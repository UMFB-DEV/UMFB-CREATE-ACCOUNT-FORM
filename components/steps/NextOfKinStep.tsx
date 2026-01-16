import { UseFormReturn } from 'react-hook-form';
import { ContactForm } from '@/lib/validation';

interface NextOfKinStepProps {
  form: UseFormReturn<ContactForm>;
}

export function NextOfKinStep({ form }: NextOfKinStepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next of Kin Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Next of Kin Name *
          </label>
          <input
            type="text"
            {...register('nextOfKinName')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter next of kin name"
          />
          {errors.nextOfKinName && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.nextOfKinName.message}</p>
          )}
        </div>

        {/* Next of Kin Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Next of Kin Phone Number *
          </label>
          <input
            type="tel"
            {...register('nextOfKinPhone')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter next of kin phone number"
          />
          {errors.nextOfKinPhone && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.nextOfKinPhone.message}</p>
          )}
        </div>

        {/* Next of Kin Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Next of Kin Email *
          </label>
          <input
            type="email"
            {...register('nextOfKinEmail')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter next of kin email"
          />
          {errors.nextOfKinEmail && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.nextOfKinEmail.message}</p>
          )}
        </div>

        {/* Next of Kin Relationship */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Next of Kin Relationship *
          </label>
          <input
            type="text"
            {...register('nextOfKinRelationship')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="e.g., Parent, Sibling, Spouse"
          />
          {errors.nextOfKinRelationship && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.nextOfKinRelationship.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
