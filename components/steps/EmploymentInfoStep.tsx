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
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Employer's Name *
          </label>
          <input
            type="text"
            {...register('employersName')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter employer's name"
          />
          {errors.employersName && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.employersName.message}</p>
          )}
        </div>

        {/* Employer's Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Employer's Country *
          </label>
          <input
            type="text"
            {...register('employersCountry')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter employer's country"
          />
          {errors.employersCountry && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.employersCountry.message}</p>
          )}
        </div>

        {/* Business Sector */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Business Sector *
          </label>
          <input
            type="text"
            {...register('businessSector')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter business sector"
          />
          {errors.businessSector && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.businessSector.message}</p>
          )}
        </div>

        {/* Means of Identification */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Means of Identification *
          </label>
          <input
            type="text"
            {...register('meansOfIdentification')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter means of identification"
          />
          {errors.meansOfIdentification && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.meansOfIdentification.message}</p>
          )}
        </div>

        {/* Politically Exposed */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Are you a Politically Exposed Person? *
          </label>
          <div className="space-x-8">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('politicallyExposed')}
                value="Yes"
                className="w-5 h-5 text-[#7B3434] border-2 border-gray-300 focus:ring-[#7B3434] focus:ring-2"
              />
              <span className="ml-3 text-gray-700 font-medium">Yes</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('politicallyExposed')}
                value="No"
                className="w-5 h-5 text-[#7B3434] border-2 border-gray-300 focus:ring-[#7B3434] focus:ring-2"
              />
              <span className="ml-3 text-gray-700 font-medium">No</span>
            </label>
          </div>
          {errors.politicallyExposed && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.politicallyExposed.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
