import { UseFormReturn } from 'react-hook-form';
import { ContactForm } from '@/lib/validation';

interface SpouseInfoStepProps {
  form: UseFormReturn<ContactForm>;
}

export function SpouseInfoStep({ form }: SpouseInfoStepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="mb-6 p-4 bg-[#ACD23C]/10 rounded-lg border border-[#ACD23C]/20">
        <p className="text-sm text-gray-700 font-medium">
          💡 Spouse information is optional. You can skip this step if not applicable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spouse Surname */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Spouse Surname
          </label>
          <input
            type="text"
            {...register('spouseSurname')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter spouse surname (optional)"
          />
          {errors.spouseSurname && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.spouseSurname.message}</p>
          )}
        </div>

        {/* Spouse Other Names */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Spouse Other Names
          </label>
          <input
            type="text"
            {...register('spouseOtherNames')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter spouse other names (optional)"
          />
          {errors.spouseOtherNames && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.spouseOtherNames.message}</p>
          )}
        </div>

        {/* Spouse Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Spouse Address
          </label>
          <textarea
            {...register('spouseAddress')}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200 resize-none"
            placeholder="Enter spouse address (optional)"
          />
          {errors.spouseAddress && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.spouseAddress.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
