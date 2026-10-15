'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fixedDepositSchema, type FixedDeposit } from '@/lib/validation';
import { formatNaira, getFixedDepositRate } from '@/lib/fixedDeposit';

export function FixedDepositForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FixedDeposit>({
    resolver: zodResolver(fixedDepositSchema),
    mode: 'onBlur',
    defaultValues: { honeypot: '' },
  });
  const amount = watch('amount');
  const tenor = watch('tenor');
  const numericAmount = Number(amount);
  const interestRate = getFixedDepositRate(numericAmount, tenor || '');

  async function submitRequest(data: FixedDeposit) {
    setError('');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      const calculatedRate = getFixedDepositRate(Number(data.amount), data.tenor);
      if (calculatedRate !== null) formData.append('interestRate', `${calculatedRate}%`);
      formData.append('formType', 'fixed-deposit');

      const response = await fetch('/api/submit-form', { method: 'POST', body: formData });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Unable to submit your fixed deposit request.');
      setIsSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to submit your fixed deposit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ACD23C] text-3xl font-bold text-white">✓</div><h2 className="text-2xl font-bold text-[#7B3434]">Fixed Deposit Request Submitted</h2><p className="mt-3 text-gray-600">Thank you. Your fixed deposit request has been submitted successfully.</p></div>;
  }

  const inputClass = 'w-full rounded border border-gray-300 px-3 py-3 text-black outline-none focus:border-transparent focus:ring-2 focus:ring-[#7B3434]';
  return (
    <form onSubmit={handleSubmit(submitRequest)} noValidate className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="grid grid-cols-1 gap-5">
        <div><label htmlFor="name" className="mb-1 block text-sm font-semibold text-gray-700">Name <span className="text-red-500">*</span></label><input id="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register('name')} className={inputClass} />{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}</div>
        <div><label htmlFor="accountNumber" className="mb-1 block text-sm font-semibold text-gray-700">Account Number <span className="text-red-500">*</span></label><input id="accountNumber" type="text" inputMode="numeric" maxLength={10} aria-invalid={Boolean(errors.accountNumber)} {...register('accountNumber')} className={inputClass} />{errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>}<p className="mt-1 text-xs text-gray-500">Enter your 10-digit UMFB account number.</p></div>
        <div><label htmlFor="amount" className="mb-1 block text-sm font-semibold text-gray-700">Amount to Fix (₦) <span className="text-red-500">*</span></label><input id="amount" type="number" inputMode="decimal" min="500000" step="0.01" placeholder="e.g. 1000000" aria-invalid={Boolean(errors.amount)} {...register('amount')} className={inputClass} />{errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}</div>
        <div><label htmlFor="tenor" className="mb-1 block text-sm font-semibold text-gray-700">Tenor <span className="text-red-500">*</span></label><select id="tenor" aria-invalid={Boolean(errors.tenor)} {...register('tenor')} className={inputClass}><option value="">Select tenor</option><option value="90 days">90 days</option><option value="180 days">180 days</option><option value="270 days">270 days</option><option value="360 days">360 days</option></select>{errors.tenor && <p className="mt-1 text-sm text-red-600">{errors.tenor.message}</p>}</div>
        {(amount && tenor) && <div className="rounded-lg bg-[#f4f8e8] p-4 text-sm text-gray-700"><p className="font-semibold text-[#7B3434]">Interest Rate</p>{interestRate !== null ? <><p className="mt-1 text-2xl font-bold text-gray-900">{interestRate}%</p><p className="mt-1">Rate for {formatNaira(numericAmount)} over {tenor}.</p></> : <p className="mt-1">{numericAmount > 0 && numericAmount < 500_000 ? 'Minimum fixed deposit amount is ₦500,000.' : 'Enter a valid amount and select a tenor to view the rate.'}</p>}</div>}
        <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="honeypot">Leave this field empty</label><input id="honeypot" type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} /></div>
      </div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="mt-7 w-full rounded-lg bg-[#7B3434] px-6 py-3 font-semibold text-white transition hover:bg-[#612929] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Submitting…' : 'Submit Fixed Deposit Request'}</button>
    </form>
  );
}
