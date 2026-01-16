'use client';

import { useState } from 'react';
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

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: {
      accountType: 'Regular Savings Account',
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
        return ['idDocument', 'passportPhoto', 'signature', 'utilityBill'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: ContactForm) => {
    if (data.honeypot) {
      // Honeypot filled - likely spam
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Form submitted successfully!');
        // Reset form or redirect
      } else {
        alert('Failed to submit form. Please try again.');
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
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
          name="honeypot"
          className="hidden"
          {...form.register('honeypot')}
        />

        <CurrentStepComponent form={form} />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
