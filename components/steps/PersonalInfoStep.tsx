import { UseFormReturn } from 'react-hook-form';
import { ContactForm } from '@/lib/validation';

interface PersonalInfoStepProps {
  form: UseFormReturn<ContactForm>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Type - Hidden field */}
        <input
          type="hidden"
          {...register('accountType')}
          value="Regular Savings Account"
        />

        {/* Referer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referer *
          </label>
          <input
            type="text"
            {...register('referer')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter referer"
          />
          {errors.referer && (
            <p className="mt-1 text-sm text-red-600">{errors.referer.message}</p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branch *
          </label>
          <input
            type="text"
            {...register('branch')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter branch"
          />
          {errors.branch && (
            <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            {...register('gender')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <select
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status *
          </label>
          <select
            {...register('maritalStatus')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Other">Other</option>
          </select>
          {errors.maritalStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.maritalStatus.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            {...register('lastName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Other Names */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Names *
          </label>
          <input
            type="text"
            {...register('otherNames')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter other names"
          />
          {errors.otherNames && (
            <p className="mt-1 text-sm text-red-600">{errors.otherNames.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            {...register('dateOfBirth')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            {...register('address')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Place of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Place of Birth *
          </label>
          <input
            type="text"
            {...register('placeOfBirth')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter place of birth"
          />
          {errors.placeOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.placeOfBirth.message}</p>
          )}
        </div>

        {/* State of Origin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State of Origin *
          </label>
          <input
            type="text"
            {...register('stateOfOrigin')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter state of origin"
          />
          {errors.stateOfOrigin && (
            <p className="mt-1 text-sm text-red-600">{errors.stateOfOrigin.message}</p>
          )}
        </div>

        {/* LGA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LGA *
          </label>
          <input
            type="text"
            {...register('lga')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter LGA"
          />
          {errors.lga && (
            <p className="mt-1 text-sm text-red-600">{errors.lga.message}</p>
          )}
        </div>

        {/* BVN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            BVN *
          </label>
          <input
            type="text"
            {...register('bvn')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 11-digit BVN"
            maxLength={11}
          />
          {errors.bvn && (
            <p className="mt-1 text-sm text-red-600">{errors.bvn.message}</p>
          )}
        </div>

        {/* NIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NIN *
          </label>
          <input
            type="text"
            {...register('nin')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 11-digit NIN"
            maxLength={11}
          />
          {errors.nin && (
            <p className="mt-1 text-sm text-red-600">{errors.nin.message}</p>
          )}
        </div>

        {/* Mother's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Name *
          </label>
          <input
            type="text"
            {...register('mothersName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter mother's name"
          />
          {errors.mothersName && (
            <p className="mt-1 text-sm text-red-600">{errors.mothersName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
