'use client';

import React, { useState, useCallback, memo } from 'react';
import { SignatureInput } from './SignatureInput';

const QuickLoanApplicationForm = memo(function QuickLoanApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    // Personal Information
    applicantFirstName: '',
    applicantMiddleName: '',
    applicantLastName: '',
    applicantDOB: '',
    idType: '',
    idNumber: '',
    sex: '',
    bvn: '',
    nationality: '',
    telephone1: '',
    telephone2: '',
    maritalStatus: '',
    houseAddress: '',
    town: '',
    lga: '',
    state: '',
    
    // Spouse Information
    spouseFirstName: '',
    spouseMiddleName: '',
    spouseLastName: '',
    spouseDOB: '',
    spouseTelephone1: '',
    spouseTelephone2: '',
    
    // Next of Kin
    nextOfKinName: '',
    nextOfKinSex: '',
    nextOfKinRelationship: '',
    nextOfKinTel: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessActivity: '',
    locationSince: '',
    businessSince: '',
    tinNo: '',
    
    // Loan Information
    loanAmount: '',
    loanMonths: '',
    monthlyRepaymentCapacity: '',
    loanPurpose: '',
    investmentPlanDetails: '',
    otherLoan: '',
    howHeard: '',
    
    // Authorization
    applicantSignature: null as File | null,
    supervisorName: '',
    supervisorSignature: null as File | null,
  };

  const [formData, setFormData] = useState<any>(initialFormData);

  const updateField = useCallback((name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  }, []);

  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Business Information' },
    { id: 3, title: 'Loan Information' },
    { id: 4, title: 'Authorization' },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((value) => value + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((value) => value - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('=== Form SUBMIT ATTEMPTED ===');
    console.log('Event:', event);
    console.log('Event type:', event.type);
    console.log('Event target:', event.target);
    console.log('currentStep:', currentStep);
    console.log('steps.length:', steps.length);

    setIsSubmitting(true);
    try {
      const submitFormData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitFormData.append(key, value);
        } else if (value !== null && value !== undefined) {
          submitFormData.append(key, String(value));
        }
      });
      
      submitFormData.append('formType', 'quick-loan');
      
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: submitFormData,
      });
      
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Form submission failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoSection formData={formData} updateField={updateField} />;
      case 2:
        return <BusinessInfoSection formData={formData} updateField={updateField} />;
      case 3:
        return <LoanInfoSection formData={formData} updateField={updateField} />;
      case 4:
        return <AuthorizationSection formData={formData} updateField={updateField} />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ACD23C] text-3xl text-white">✓</div>
        <h2 className="text-3xl font-bold text-[#7B3434] mb-4">Loan Application Submitted</h2>
        <p className="text-gray-600">Thank you. Your quick loan application has been recorded successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }} className="space-y-10">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-6">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7B3434]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7B3434] text-white">{currentStep}</span>
            <span>Step {currentStep} of {steps.length}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{steps[currentStep - 1].title}</h1>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl bg-gray-100">
          <div
            className="h-2 bg-[#7B3434] transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {renderCurrentStep()}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={prevStep}
          className="inline-flex items-center justify-center rounded-full bg-[#ACD23C] px-8 py-4 text-sm font-semibold text-gray-900 transition hover:bg-[#9bb82a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {currentStep === steps.length ? (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e as any)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7B3434] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#6a2d2d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              'Submit Loan Application'
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center justify-center rounded-full bg-[#7B3434] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#6a2d2d]"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
});

const PersonalInfoSection = memo(function PersonalInfoSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">1. Personal Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">First Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.applicantFirstName}
            onChange={(e) => updateField('applicantFirstName', e.target.value)}
            placeholder="Enter first name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Middle Name</label>
          <input
            type="text"
            value={formData.applicantMiddleName}
            onChange={(e) => updateField('applicantMiddleName', e.target.value)}
            placeholder="Enter middle name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Last Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.applicantLastName}
            onChange={(e) => updateField('applicantLastName', e.target.value)}
            placeholder="Enter last name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={formData.applicantDOB}
            onChange={(e) => updateField('applicantDOB', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Type of ID <span className="text-red-500">*</span></label>
          <select
            value={formData.idType}
            onChange={(e) => updateField('idType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          >
            <option value="">Select ID type</option>
            <option value="nin">NIN</option>
            <option value="pvc">PVC</option>
            <option value="passport">International Passport</option>
            <option value="drivers">Driver's License</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">ID Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) => updateField('idNumber', e.target.value)}
            placeholder="Enter ID number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Sex <span className="text-red-500">*</span></label>
          <select
            value={formData.sex}
            onChange={(e) => updateField('sex', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          >
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">BVN <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.bvn}
            onChange={(e) => updateField('bvn', e.target.value)}
            placeholder="Enter BVN"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Nationality (non-Nigerian only)</label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => updateField('nationality', e.target.value)}
            placeholder="Enter nationality"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number 1 <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={formData.telephone1}
            onChange={(e) => updateField('telephone1', e.target.value)}
            placeholder="Enter telephone number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number 2</label>
          <input
            type="tel"
            value={formData.telephone2}
            onChange={(e) => updateField('telephone2', e.target.value)}
            placeholder="Enter second telephone number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Marital Status <span className="text-red-500">*</span></label>
          <select
            value={formData.maritalStatus}
            onChange={(e) => updateField('maritalStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          >
            <option value="">Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block font-semibold text-sm mb-1 text-gray-700">House Address <span className="text-red-500">*</span></label>
          <textarea
            value={formData.houseAddress}
            onChange={(e) => updateField('houseAddress', e.target.value)}
            placeholder="Enter house address"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm resize-y text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Town <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.town}
            onChange={(e) => updateField('town', e.target.value)}
            placeholder="Enter town"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">LGA <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.lga}
            onChange={(e) => updateField('lga', e.target.value)}
            placeholder="Enter LGA"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">State <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => updateField('state', e.target.value)}
            placeholder="Enter state"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-xl font-bold text-[#7B3434] mb-4">Spouse Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">First Name</label>
            <input
              type="text"
              value={formData.spouseFirstName}
              onChange={(e) => updateField('spouseFirstName', e.target.value)}
              placeholder="Enter spouse's first name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Middle Name</label>
            <input
              type="text"
              value={formData.spouseMiddleName}
              onChange={(e) => updateField('spouseMiddleName', e.target.value)}
              placeholder="Enter spouse's middle name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.spouseLastName}
              onChange={(e) => updateField('spouseLastName', e.target.value)}
              placeholder="Enter spouse's last name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={formData.spouseDOB}
              onChange={(e) => updateField('spouseDOB', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number 1</label>
            <input
              type="tel"
              value={formData.spouseTelephone1}
              onChange={(e) => updateField('spouseTelephone1', e.target.value)}
              placeholder="Enter telephone number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number 2</label>
            <input
              type="tel"
              value={formData.spouseTelephone2}
              onChange={(e) => updateField('spouseTelephone2', e.target.value)}
              placeholder="Enter second telephone number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-xl font-bold text-[#7B3434] mb-4">Next of Kin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Name of Next of Kin <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.nextOfKinName}
              onChange={(e) => updateField('nextOfKinName', e.target.value)}
              placeholder="Enter next of kin name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Sex <span className="text-red-500">*</span></label>
            <select
              value={formData.nextOfKinSex}
              onChange={(e) => updateField('nextOfKinSex', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
              required
            >
              <option value="">Select sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Relationship <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.nextOfKinRelationship}
              onChange={(e) => updateField('nextOfKinRelationship', e.target.value)}
              placeholder="Enter relationship"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={formData.nextOfKinTel}
              onChange={(e) => updateField('nextOfKinTel', e.target.value)}
              placeholder="Enter telephone number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
              required
            />
          </div>
        </div>
      </div>
    </section>
  );
});

const BusinessInfoSection = memo(function BusinessInfoSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">2. Business Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            placeholder="Enter business name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Type <span className="text-red-500">*</span></label>
          <select
            value={formData.businessType}
            onChange={(e) => updateField('businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          >
            <option value="">Select business type</option>
            <option value="no-registration">No Registration</option>
            <option value="sole-proprietor">Sole Proprietor</option>
            <option value="ltd">Limited Liability Company (Ltd)</option>
            <option value="partnership">Partnership</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Address <span className="text-red-500">*</span></label>
          <textarea
            value={formData.businessAddress}
            onChange={(e) => updateField('businessAddress', e.target.value)}
            placeholder="Enter business address"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm resize-y text-black"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Activity <span className="text-red-500">*</span></label>
          <textarea
            value={formData.businessActivity}
            onChange={(e) => updateField('businessActivity', e.target.value)}
            placeholder="Describe business activity"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm resize-y text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Location Since (Years) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={formData.locationSince}
            onChange={(e) => updateField('locationSince', e.target.value)}
            placeholder="Years at current location"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Since (Years) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={formData.businessSince}
            onChange={(e) => updateField('businessSince', e.target.value)}
            placeholder="Years in business"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">TIN No.</label>
          <input
            type="text"
            value={formData.tinNo}
            onChange={(e) => updateField('tinNo', e.target.value)}
            placeholder="Enter TIN number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          />
        </div>
      </div>
    </section>
  );
});

const LoanInfoSection = memo(function LoanInfoSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">3. Loan Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Loan Amount <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={formData.loanAmount}
            onChange={(e) => updateField('loanAmount', e.target.value)}
            placeholder="Enter loan amount"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Months <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={formData.loanMonths}
            onChange={(e) => updateField('loanMonths', e.target.value)}
            placeholder="Enter number of months"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Monthly Repayment Capacity <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={formData.monthlyRepaymentCapacity}
            onChange={(e) => updateField('monthlyRepaymentCapacity', e.target.value)}
            placeholder="How much can you pay monthly"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Loan Purpose <span className="text-red-500">*</span></label>
          <select
            value={formData.loanPurpose}
            onChange={(e) => updateField('loanPurpose', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          >
            <option value="">Select loan purpose</option>
            <option value="working-capital">Working Capital</option>
            <option value="fixed-asset">Fixed Asset</option>
            <option value="new-activity">New Activity</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Have a loan with another institution?</label>
          <select
            value={formData.otherLoan}
            onChange={(e) => updateField('otherLoan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block font-semibold text-sm mb-1 text-gray-700">Details of Investment Plan <span className="text-red-500">*</span></label>
        <textarea
          value={formData.investmentPlanDetails}
          onChange={(e) => updateField('investmentPlanDetails', e.target.value)}
          placeholder="Describe your investment plan"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm resize-y text-black"
          required
        />
      </div>
      
      <div>
        <label className="block font-semibold text-sm mb-1 text-gray-700">How did you hear about Unilag MFB?</label>
        <input
          type="text"
          value={formData.howHeard}
          onChange={(e) => updateField('howHeard', e.target.value)}
          placeholder="Tell us how you heard about us"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
        />
      </div>
    </section>
  );
});

const AuthorizationSection = memo(function AuthorizationSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">4. Authorization</h2>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-sm text-gray-700 leading-relaxed">
        <p className="mb-4">
          I hereby confirm that the above information given by me are true, correct and complete. I agree that relationship officer and/or his/her supervisor visit my business and residence in order to carry out the loan assessment process and do assessment of income and assets offered as collateral security for any loan that might be granted. I will give all required Information for this purpose.
        </p>
        <p className="mb-4">
          In connection to this loan application, I explicitly agree and authorise UnilagMFB (hereafter "the Bank") to obtain such information as may be required from third parties, If it is considered important by the Bank for the final decision of the loan application.
        </p>
        <p className="mb-4">
          I consent to the sharing/continuous sharing of my credit information with credit bureau and/or other regulatory authorities without further recourse to my execution of the document.
        </p>
        <p>
          The applicant understands that the signature under this loan application form does not guarantee reception of a loan from the bank and that the bank reserves the right to reject or adjust the loan request and terms of the transaction in line with its credit risk policies.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Applicant Signature <span className="text-red-500">*</span></label>
          <SignatureInput
            label=""
            value={formData.applicantSignature}
            onChange={(value) => updateField('applicantSignature', value)}
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Supervisor Name</label>
            <input
              type="text"
              value={formData.supervisorName}
              onChange={(e) => updateField('supervisorName', e.target.value)}
              placeholder="Enter supervisor name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Supervisor Signature</label>
            <SignatureInput
              label=""
              value={formData.supervisorSignature}
              onChange={(value) => updateField('supervisorSignature', value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

export default QuickLoanApplicationForm;
