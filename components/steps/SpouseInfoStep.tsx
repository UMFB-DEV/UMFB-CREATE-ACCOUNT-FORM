import { UseFormReturn } from 'react-hook-form';
import { ContactForm } from '@/lib/validation';

interface SpouseInfoStepProps {
  form: UseFormReturn<ContactForm>;
}

export function SpouseInfoStep({ form }: SpouseInfoStepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Spouse information is optional. You can skip this step if not applicable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spouse Surname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spouse Surname
          </label>
          <input
            type="text"
            {...register('spouseSurname')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter spouse surname (optional)"
          />
          {errors.spouseSurname && (
            <p className="mt-1 text-sm text-red-600">{errors.spouseSurname.message}</p>
          )}
        </div>

        {/* Spouse Other Names */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spouse Other Names
          </label>
          <input
            type="text"
            {...register('spouseOtherNames')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter spouse other names (optional)"
          />
          {errors.spouseOtherNames && (
            <p className="mt-1 text-sm text-red-600">{errors.spouseOtherNames.message}</p>
          )}
        </div>

        {/* Spouse Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spouse Address
          </label>
          <textarea
            {...register('spouseAddress')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter spouse address (optional)"
          />
          {errors.spouseAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.spouseAddress.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
