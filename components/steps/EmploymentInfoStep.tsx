import { UseFormReturn } from 'react-hook-form';
import { ContactForm } from '@/lib/validation';

interface EmploymentInfoStepProps {
  form: UseFormReturn<ContactForm>;
}

export function EmploymentInfoStep({ form }: EmploymentInfoStepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employer's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employer's Name *
          </label>
          <input
            type="text"
            {...register('employersName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter employer's name"
          />
          {errors.employersName && (
            <p className="mt-1 text-sm text-red-600">{errors.employersName.message}</p>
          )}
        </div>

        {/* Employer's Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employer's Country *
          </label>
          <input
            type="text"
            {...register('employersCountry')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter employer's country"
          />
          {errors.employersCountry && (
            <p className="mt-1 text-sm text-red-600">{errors.employersCountry.message}</p>
          )}
        </div>

        {/* Business Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Sector *
          </label>
          <input
            type="text"
            {...register('businessSector')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business sector"
          />
          {errors.businessSector && (
            <p className="mt-1 text-sm text-red-600">{errors.businessSector.message}</p>
          )}
        </div>

        {/* Means of Identification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Means of Identification *
          </label>
          <input
            type="text"
            {...register('meansOfIdentification')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter means of identification"
          />
          {errors.meansOfIdentification && (
            <p className="mt-1 text-sm text-red-600">{errors.meansOfIdentification.message}</p>
          )}
        </div>

        {/* Politically Exposed */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you a Politically Exposed Person? *
          </label>
          <div className="space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('politicallyExposed')}
                value="Yes"
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('politicallyExposed')}
                value="No"
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {errors.politicallyExposed && (
            <p className="mt-1 text-sm text-red-600">{errors.politicallyExposed.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
