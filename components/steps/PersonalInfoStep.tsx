import { UseFormReturn } from "react-hook-form";
import { ContactForm } from "@/lib/validation";

interface PersonalInfoStepProps {
  form: UseFormReturn<ContactForm>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Account Type *
          </label>
          <select
            {...register("accountType")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 bg-white transition-all duration-200"
          >
            <option value="" disabled>
              Select an account type
            </option>
            <option value="CORPORATE CURRENT ACCOUNT">
              CORPORATE CURRENT ACCOUNT
            </option>
            <option value="DAILY SAVINGS ACCOUNT">DAILY SAVINGS ACCOUNT</option>
            <option value="GROUP SAVINGS ACCOUNT">GROUP SAVINGS ACCOUNT</option>
            <option value="JOLLY BOUNTY">JOLLY BOUNTY</option>
            <option value="JOLLY FLEX">JOLLY FLEX</option>
            <option value="JOLLY SUPER">JOLLY SUPER</option>
            <option value="LOAN EQUITY CONTRIBUTION-MANDATORY ACCOUNT">
              LOAN EQUITY CONTRIBUTION-MANDATORY ACCOUNT
            </option>
            <option value="MUTUAL FUNDS INVESTMENT ACCOUNT">
              MUTUAL FUNDS INVESTMENT ACCOUNT
            </option>
            <option value="MYGOAL TARGET SAVINGS">MYGOAL TARGET SAVINGS</option>
            <option value="MYumbrella TERGET SAVINGS ACCOUNT">
              MYumbrella TERGET SAVINGS ACCOUNT
            </option>
            <option value="PRESTIGE TARGET SAVINGS QR-CODE SAVINGS ACCOUNT">
              PRESTIGE TARGET SAVINGS QR-CODE SAVINGS ACCOUNT
            </option>
            <option value="REGULAR SAVINGS ACCOUNT">
              REGULAR SAVINGS ACCOUNT
            </option>
            <option value="SME FLEX ACCOUNT">SME FLEX ACCOUNT</option>
            <option value="STAFF CURRENT ACCOUNT">STAFF CURRENT ACCOUNT</option>
            <option value="STAFF SAVINGS ACCOUNT">STAFF SAVINGS ACCOUNT</option>
          </select>
          {errors.accountType && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.accountType.message}
            </p>
          )}
        </div>

        {/* Referer */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Referer *
          </label>
          <input
            type="text"
            {...register("referer")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter referer"
          />
          {errors.referer && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.referer.message}
            </p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Branch *
          </label>
          <select
            {...register("branch")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 bg-white transition-all duration-200"
          >
            <option value="" disabled>
              Select a branch
            </option>
            <option value="Headquarters">Headquarters</option>
            <option value="Idi Araba Branch">Idi Araba Branch</option>
          </select>
          {errors.branch && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.branch.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Gender *
          </label>
          <select
            {...register("gender")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 bg-white transition-all duration-200"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Title *
          </label>
          <select
            {...register("title")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 bg-white transition-all duration-200"
          >
            <option value="">Select title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Marital Status *
          </label>
          <select
            {...register("maritalStatus")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 bg-white transition-all duration-200"
          >
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Other">Other</option>
          </select>
          {errors.maritalStatus && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.maritalStatus.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            {...register("lastName")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Other Names */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Other Names *
          </label>
          <input
            type="text"
            {...register("otherNames")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter other names"
          />
          {errors.otherNames && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.otherNames.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 transition-all duration-200"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Address *
          </label>
          <textarea
            {...register("address")}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200 resize-none"
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Place of Birth */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Place of Birth *
          </label>
          <input
            type="text"
            {...register("placeOfBirth")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter place of birth"
          />
          {errors.placeOfBirth && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.placeOfBirth.message}
            </p>
          )}
        </div>

        {/* State of Origin */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            State of Origin *
          </label>
          <input
            type="text"
            {...register("stateOfOrigin")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter state of origin"
          />
          {errors.stateOfOrigin && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.stateOfOrigin.message}
            </p>
          )}
        </div>

        {/* LGA */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            LGA *
          </label>
          <input
            type="text"
            {...register("lga")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter LGA"
          />
          {errors.lga && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.lga.message}
            </p>
          )}
        </div>

        {/* BVN */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            BVN *
          </label>
          <input
            type="text"
            {...register("bvn")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter 11-digit BVN"
            maxLength={11}
          />
          {errors.bvn && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.bvn.message}
            </p>
          )}
        </div>

        {/* NIN */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            NIN *
          </label>
          <input
            type="text"
            {...register("nin")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter 11-digit NIN"
            maxLength={11}
          />
          {errors.nin && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.nin.message}
            </p>
          )}
        </div>

        {/* Mother's Maiden Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Mother&apos;s Maiden Name *
          </label>
          <input
            type="text"
            {...register("mothersName")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 placeholder-gray-400 transition-all duration-200"
            placeholder="Enter mother's maiden name"
          />
          {errors.mothersName && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.mothersName.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
