'use client';

import React, { useState, useCallback, memo } from 'react';
import { SignatureInput } from './SignatureInput';

const QuickLoanApplicationForm = memo(function QuickLoanApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    // Client Information
    isNewClient: false,
    isRecurringClient: false,
    clientIdNo: '',
    
    // Personal Information
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    type_of_id: '',
    id_number: '',
    sex: '',
    bvn: '',
    nationality: '',
    telephone_1: '',
    telephone_2: '',
    marital_married: false,
    marital_single: false,
    marital_separated: false,
    marital_widow: false,
    house_address: '',
    town: '',
    lga: '',
    state: '',
    
    // Spouse Information
    spouse_first_name: '',
    spouse_middle_name: '',
    spouse_last_name: '',
    spouse_date_of_birth: '',
    spouse_telephone_1: '',
    spouse_telephone_2: '',
    
    // Next of Kin
    next_of_kin_name: '',
    next_of_kin_sex: '',
    next_of_kin_relationship: '',
    next_of_kin_tel: '',
    
    // Business Information
    business_name: '',
    biztype_no_registration: false,
    biztype_sole_proprietor: false,
    biztype_ltd: false,
    biztype_partnership: false,
    business_address: '',
    business_activity: '',
    location_since: '',
    business_since: '',
    tin_no: '',
    
    // Loan Information
    loan_amount: '',
    loan_months: '',
    monthly_repayment_capacity: '',
    purpose_working_capital: false,
    purpose_fixed_asset: false,
    purpose_new_activity: false,
    investment_plan_detail: '',
    existing_loan_yes: false,
    existing_loan_no: false,
    heard_friend: false,
    heard_online_advertisement: false,
    heard_relationship_officer: false,
    heard_handbill: false,
    heard_others: false,
    
    // Authorization
    applicant_signature: null as File | null,
    applicant_signature_date: '',
    ro_ca: '',
    official_date: '',
    supervisor_signature: null as File | null,
    assigned_ro: '',
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
      <div className="w-full border border-gray-200 bg-white py-6 text-center shadow-lg">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ACD23C] text-3xl text-white">✓</div>
        <div className="w-full px-4">
          <h2 className="text-2xl font-bold text-[#7B3434] mb-4">Loan Application Submitted</h2>
          <p className="text-gray-600">Thank you. Your quick loan application has been recorded successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }} className="space-y-10">
      <div className="w-full border border-gray-200 bg-white py-6 shadow-lg">
        <div className="mb-6 w-full px-4">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7B3434]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7B3434] text-white">{currentStep}</span>
            <span>Step {currentStep} of {steps.length}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h1>
        </div>

        <div className="mb-8 w-full px-4 overflow-hidden rounded-2xl bg-gray-100">
          <div
            className="h-2 bg-[#7B3434] transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="w-full px-4">
          {renderCurrentStep()}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between w-full px-4">
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
          <label className="block font-semibold text-sm mb-1 text-gray-700">Client Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isNewClient}
                onChange={(e) => updateField('isNewClient', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              New Client
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isRecurringClient}
                onChange={(e) => updateField('isRecurringClient', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Recurring Client
            </label>
          </div>
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Client ID No.</label>
          <input
            type="text"
            value={formData.clientIdNo}
            onChange={(e) => updateField('clientIdNo', e.target.value)}
            placeholder="Enter client ID"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">First Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
            placeholder="Enter first name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Middle Name</label>
          <input
            type="text"
            value={formData.middle_name}
            onChange={(e) => updateField('middle_name', e.target.value)}
            placeholder="Enter middle name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Last Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
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
            value={formData.date_of_birth}
            onChange={(e) => updateField('date_of_birth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Type of ID <span className="text-red-500">*</span></label>
          <select
            value={formData.type_of_id}
            onChange={(e) => updateField('type_of_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          >
            <option value="">Select ID type</option>
            <option value="NIN">NIN</option>
            <option value="PVC">PVC</option>
            <option value="Passport">International Passport</option>
            <option value="Driver's License">Driver's License</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">ID Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.id_number}
            onChange={(e) => updateField('id_number', e.target.value)}
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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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
            value={formData.telephone_1}
            onChange={(e) => updateField('telephone_1', e.target.value)}
            placeholder="Enter telephone number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number 2</label>
          <input
            type="tel"
            value={formData.telephone_2}
            onChange={(e) => updateField('telephone_2', e.target.value)}
            placeholder="Enter second telephone number"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Marital Status <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.marital_single}
                onChange={(e) => updateField('marital_single', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Single
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.marital_married}
                onChange={(e) => updateField('marital_married', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Married
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.marital_separated}
                onChange={(e) => updateField('marital_separated', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Separated
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.marital_widow}
                onChange={(e) => updateField('marital_widow', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Widow
            </label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block font-semibold text-sm mb-1 text-gray-700">House Address <span className="text-red-500">*</span></label>
          <textarea
            value={formData.house_address}
            onChange={(e) => updateField('house_address', e.target.value)}
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
              value={formData.spouse_first_name}
              onChange={(e) => updateField('spouse_first_name', e.target.value)}
              placeholder="Enter spouse's first name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Middle Name</label>
            <input
              type="text"
              value={formData.spouse_middle_name}
              onChange={(e) => updateField('spouse_middle_name', e.target.value)}
              placeholder="Enter spouse's middle name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.spouse_last_name}
              onChange={(e) => updateField('spouse_last_name', e.target.value)}
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
              value={formData.spouse_date_of_birth}
              onChange={(e) => updateField('spouse_date_of_birth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number 1</label>
            <input
              type="tel"
              value={formData.spouse_telephone_1}
              onChange={(e) => updateField('spouse_telephone_1', e.target.value)}
              placeholder="Enter telephone number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number 2</label>
            <input
              type="tel"
              value={formData.spouse_telephone_2}
              onChange={(e) => updateField('spouse_telephone_2', e.target.value)}
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
              value={formData.next_of_kin_name}
              onChange={(e) => updateField('next_of_kin_name', e.target.value)}
              placeholder="Enter next of kin name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Sex <span className="text-red-500">*</span></label>
            <select
              value={formData.next_of_kin_sex}
              onChange={(e) => updateField('next_of_kin_sex', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
              required
            >
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Relationship <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.next_of_kin_relationship}
              onChange={(e) => updateField('next_of_kin_relationship', e.target.value)}
              placeholder="Enter relationship"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Telephone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={formData.next_of_kin_tel}
              onChange={(e) => updateField('next_of_kin_tel', e.target.value)}
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
            value={formData.business_name}
            onChange={(e) => updateField('business_name', e.target.value)}
            placeholder="Enter business name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Type <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.biztype_no_registration}
                onChange={(e) => updateField('biztype_no_registration', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              No Registration
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.biztype_sole_proprietor}
                onChange={(e) => updateField('biztype_sole_proprietor', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Sole Proprietor
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.biztype_ltd}
                onChange={(e) => updateField('biztype_ltd', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Ltd
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.biztype_partnership}
                onChange={(e) => updateField('biztype_partnership', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[#7B3434]"
              />
              Partnership
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Address <span className="text-red-500">*</span></label>
          <textarea
            value={formData.business_address}
            onChange={(e) => updateField('business_address', e.target.value)}
            placeholder="Enter business address"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm resize-y text-black"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Activity <span className="text-red-500">*</span></label>
          <textarea
            value={formData.business_activity}
            onChange={(e) => updateField('business_activity', e.target.value)}
            placeholder="Describe business activity"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm resize-y text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Location Since (Years) <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.location_since}
            onChange={(e) => updateField('location_since', e.target.value)}
            placeholder="Years at current location"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Business Since (Years) <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.business_since}
            onChange={(e) => updateField('business_since', e.target.value)}
            placeholder="Years in business"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">TIN No.</label>
          <input
            type="text"
            value={formData.tin_no}
            onChange={(e) => updateField('tin_no', e.target.value)}
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
            type="text"
            value={formData.loan_amount}
            onChange={(e) => updateField('loan_amount', e.target.value)}
            placeholder="Enter loan amount"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Months <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.loan_months}
            onChange={(e) => updateField('loan_months', e.target.value)}
            placeholder="Enter number of months"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Monthly Repayment Capacity <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.monthly_repayment_capacity}
            onChange={(e) => updateField('monthly_repayment_capacity', e.target.value)}
            placeholder="How much can you pay monthly"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block font-semibold text-sm mb-1 text-gray-700">Loan Purpose <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.purpose_working_capital}
              onChange={(e) => updateField('purpose_working_capital', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Working Capital
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.purpose_fixed_asset}
              onChange={(e) => updateField('purpose_fixed_asset', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Fixed Asset
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.purpose_new_activity}
              onChange={(e) => updateField('purpose_new_activity', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            New Activity
          </label>
        </div>
      </div>
      
      <div>
        <label className="block font-semibold text-sm mb-1 text-gray-700">Details of Investment Plan <span className="text-red-500">*</span></label>
        <textarea
          value={formData.investment_plan_detail}
          onChange={(e) => updateField('investment_plan_detail', e.target.value)}
          placeholder="Describe your investment plan"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm resize-y text-black"
          required
        />
      </div>
      
      <div>
        <label className="block font-semibold text-sm mb-1 text-gray-700">Have a loan with another institution?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.existing_loan_yes}
              onChange={(e) => updateField('existing_loan_yes', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.existing_loan_no}
              onChange={(e) => updateField('existing_loan_no', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            No
          </label>
        </div>
      </div>
      
      <div>
        <label className="block font-semibold text-sm mb-1 text-gray-700">How did you hear about Unilag MFB?</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.heard_friend}
              onChange={(e) => updateField('heard_friend', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Friend
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.heard_online_advertisement}
              onChange={(e) => updateField('heard_online_advertisement', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Online Advertisement
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.heard_relationship_officer}
              onChange={(e) => updateField('heard_relationship_officer', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Relationship Officer
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.heard_handbill}
              onChange={(e) => updateField('heard_handbill', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Handbill
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.heard_others}
              onChange={(e) => updateField('heard_others', e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7B3434]"
            />
            Others
          </label>
        </div>
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
            value={formData.applicant_signature}
            onChange={(value) => updateField('applicant_signature', value)}
          />
        </div>
        <div>
          <label className="block font-semibold text-sm mb-1 text-gray-700">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={formData.applicant_signature_date}
            onChange={(e) => updateField('applicant_signature_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            required
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-xl font-bold text-[#7B3434] mb-4">For Bank Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">RO/CA</label>
            <input
              type="text"
              value={formData.ro_ca}
              onChange={(e) => updateField('ro_ca', e.target.value)}
              placeholder="Enter RO/CA"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Date</label>
            <input
              type="date"
              value={formData.official_date}
              onChange={(e) => updateField('official_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">Supervisor Signature</label>
            <SignatureInput
              label=""
              value={formData.supervisor_signature}
              onChange={(value) => updateField('supervisor_signature', value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block font-semibold text-sm mb-1 text-gray-700">Assigned RO</label>
            <input
              type="text"
              value={formData.assigned_ro}
              onChange={(e) => updateField('assigned_ro', e.target.value)}
              placeholder="Enter assigned RO"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-transparent text-sm text-black"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

export default QuickLoanApplicationForm;
