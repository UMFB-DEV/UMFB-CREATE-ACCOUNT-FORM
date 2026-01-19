'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactForm } from '@/lib/validation';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { EmploymentInfoStep } from './steps/EmploymentInfoStep';
import { NextOfKinStep } from './steps/NextOfKinStep';
import { SpouseInfoStep } from './steps/SpouseInfoStep';
import { FileUploadsStep } from './steps/FileUploadsStep';

const steps = [
  { id: 1, name: 'Personal Information', component: PersonalInfoStep },
  { id: 2, name: 'Employment Information', component: EmploymentInfoStep },
  { id: 3, name: 'Next of Kin', component: NextOfKinStep },
  { id: 4, name: 'Spouse Information', component: SpouseInfoStep },
  { id: 5, name: 'File Uploads', component: FileUploadsStep },
];

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onSubmit', // Only validate on submit to prevent premature file validation
    defaultValues: {
      honeypot: '', // Hidden honeypot field
    },
  });

  const { handleSubmit, trigger, formState: { errors } } = form;

  const nextStep = async () => {
    const currentStepSchema = getCurrentStepSchema();
    const isValid = await trigger(currentStepSchema);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getCurrentStepSchema = (): (keyof ContactForm)[] => {
    switch (currentStep) {
      case 0:
        return [
          'accountType', 'referer', 'branch', 'gender', 'title', 'maritalStatus',
          'lastName', 'otherNames', 'dateOfBirth', 'address', 'placeOfBirth',
          'stateOfOrigin', 'lga', 'bvn', 'nin', 'mothersName', 'email', 'phone'
        ];
      case 1:
        return ['employersName', 'employersCountry', 'businessSector', 'meansOfIdentification', 'politicallyExposed'];
      case 2:
        return ['nextOfKinName', 'nextOfKinPhone', 'nextOfKinEmail', 'nextOfKinRelationship'];
      case 3:
        return ['spouseSurname', 'spouseOtherNames', 'spouseAddress'];
      case 4:
        // Don't validate files during step navigation - only on final submit
        return [];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ContactForm) => {
    // Log the form data
    console.log('Form submitted with data:', data);

    // Check file uploads specifically
    const files = {
      idDocument: data.idDocument,
      passportPhoto: data.passportPhoto,
      signature: data.signature,
      utilityBill: data.utilityBill,
    };
    console.log('File uploads status:', {
      idDocument: files.idDocument ? `${files.idDocument.name} (${files.idDocument.size} bytes)` : 'NOT SELECTED',
      passportPhoto: files.passportPhoto ? `${files.passportPhoto.name} (${files.passportPhoto.size} bytes)` : 'NOT SELECTED',
      signature: files.signature ? `${files.signature.name} (${files.signature.size} bytes)` : 'NOT SELECTED',
      utilityBill: files.utilityBill ? `${files.utilityBill.name} (${files.utilityBill.size} bytes)` : 'NOT SELECTED',
    });

    if (data.honeypot) {
      // Honeypot filled - likely spam
      console.log('Spam detected via honeypot');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      let fileCount = 0;

      // Add all form fields
      console.log('Preparing FormData for submission...');
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
          console.log(`Adding file to FormData: ${key} - ${value.name} (${value.size} bytes, type: ${value.type})`);
          fileCount++;
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      console.log(`Total files added to FormData: ${fileCount}`);
      console.log('Sending form data to API...');

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        setIsSubmitted(true);
      } else {
        console.error('Form submission failed with status:', response.status);
        
        // Try to get detailed error info
        try {
          const errorData = await response.json();
          console.error('=== API ERROR DETAILS ===');
          console.error('Success:', errorData.success);
          console.error('Message:', errorData.message);
          
          if (errorData.debug) {
            console.error('=== DEBUG INFORMATION ===');
            console.error('Error Type:', errorData.debug.errorType);
            console.error('Error Message:', errorData.debug.errorMessage);
            console.error('Error Stack:', errorData.debug.errorStack);
            
            if (errorData.debug.pdfDocumentType) {
              console.error('PDF Document Type:', errorData.debug.pdfDocumentType);
              console.error('PDF Document Value:', errorData.debug.pdfDocumentValue);
            }
          }
          
          alert(`Form submission failed: ${errorData.message || 'Unknown error'}`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          alert('Failed to submit form. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;


  // Show success message after submission
  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600">
            We will review your application shortly and your account will be ready soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-[#7B3434] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    index < currentStep ? 'bg-[#7B3434]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-800">
          {steps[currentStep].name}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden honeypot field */}
        <input
          type="text"
          className="hidden"
          {...form.register('honeypot')}
        />

        <CurrentStepComponent form={form} />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-8 py-4 bg-[#ACD23C] text-gray-800 rounded-full hover:bg-[#9BB82A] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Back
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-[#7B3434] text-white rounded-full hover:bg-[#6A2D2D] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-4 bg-[#7B3434] text-white rounded-full hover:bg-[#6A2D2D] font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
