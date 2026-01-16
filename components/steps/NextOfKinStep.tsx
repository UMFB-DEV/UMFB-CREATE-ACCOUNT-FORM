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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next of Kin Name *
          </label>
          <input
            type="text"
            {...register('nextOfKinName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter next of kin name"
          />
          {errors.nextOfKinName && (
            <p className="mt-1 text-sm text-red-600">{errors.nextOfKinName.message}</p>
          )}
        </div>

        {/* Next of Kin Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next of Kin Phone Number *
          </label>
          <input
            type="tel"
            {...register('nextOfKinPhone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter next of kin phone number"
          />
          {errors.nextOfKinPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.nextOfKinPhone.message}</p>
          )}
        </div>

        {/* Next of Kin Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next of Kin Email *
          </label>
          <input
            type="email"
            {...register('nextOfKinEmail')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter next of kin email"
          />
          {errors.nextOfKinEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.nextOfKinEmail.message}</p>
          )}
        </div>

        {/* Next of Kin Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next of Kin Relationship *
          </label>
          <input
            type="text"
            {...register('nextOfKinRelationship')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Parent, Sibling, Spouse"
          />
          {errors.nextOfKinRelationship && (
            <p className="mt-1 text-sm text-red-600">{errors.nextOfKinRelationship.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
