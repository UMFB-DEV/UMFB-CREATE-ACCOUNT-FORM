'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { atmApplicationSchema, type AtmApplication } from '@/lib/validation';

export function AtmApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AtmApplication>({
    resolver: zodResolver(atmApplicationSchema),
    mode: 'onBlur',
    defaultValues: { honeypot: '' },
  });

  async function submitApplication(data: AtmApplication) {
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
      });
      formData.append('formType', 'atm-application');

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || 'Unable to submit your ATM application.');
      }

      setIsSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to submit your ATM application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ACD23C] text-3xl font-bold text-white">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-[#7B3434]">ATM Application Submitted</h2>
        <p className="mt-3 text-gray-600">Thank you. Your ATM card application has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submitApplication)} noValidate className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-semibold text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input id="firstName" type="text" autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} {...register('firstName')} className="w-full rounded border border-gray-300 px-3 py-3 text-black outline-none focus:border-transparent focus:ring-2 focus:ring-[#7B3434]" />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm font-semibold text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input id="lastName" type="text" autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} {...register('lastName')} className="w-full rounded border border-gray-300 px-3 py-3 text-black outline-none focus:border-transparent focus:ring-2 focus:ring-[#7B3434]" />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="accountNumber" className="mb-1 block text-sm font-semibold text-gray-700">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input id="accountNumber" type="text" inputMode="numeric" autoComplete="off" maxLength={10} aria-invalid={Boolean(errors.accountNumber)} {...register('accountNumber')} className="w-full rounded border border-gray-300 px-3 py-3 text-black outline-none focus:border-transparent focus:ring-2 focus:ring-[#7B3434]" />
          {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>}
          <p className="mt-1 text-xs text-gray-500">Enter your 10-digit UMFB account number.</p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="phoneNumber" className="mb-1 block text-sm font-semibold text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input id="phoneNumber" type="tel" inputMode="numeric" autoComplete="tel" maxLength={11} aria-invalid={Boolean(errors.phoneNumber)} {...register('phoneNumber')} className="w-full rounded border border-gray-300 px-3 py-3 text-black outline-none focus:border-transparent focus:ring-2 focus:ring-[#7B3434]" />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
          <p className="mt-1 text-xs text-gray-500">Enter your 11-digit phone number.</p>
        </div>

        <div className="absolute -left-[10000px]" aria-hidden="true">
          <label htmlFor="honeypot">Leave this field empty</label>
          <input id="honeypot" type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
        </div>
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="mt-7 w-full rounded-lg bg-[#7B3434] px-6 py-3 font-semibold text-white transition hover:bg-[#612929] disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Submitting…' : 'Submit ATM Application'}
      </button>
    </form>
  );
}
