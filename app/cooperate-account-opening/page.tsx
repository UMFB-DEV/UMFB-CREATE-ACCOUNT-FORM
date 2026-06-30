import Image from 'next/image';
import { CorporateAccountOpeningForm } from '@/components/CorporateAccountOpeningForm';

export default function CooperateAccountOpeningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 overflow-y-scroll scrollbar-hide">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full">
            <Image
              src="/Untitled-design-28.png"
              alt="UNILAG Microfinance Bank"
              height={84}
              width={94}
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Cooperate Account Opening</h1>
          <p className="text-lg text-gray-600 font-medium">
            Corporate account opening form for UNILAG Microfinance Bank.
          </p>
          <div className="mt-5 mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#ACD23C] to-[#7B3434]" />
        </div>

        <CorporateAccountOpeningForm />
      </div>
    </div>
  );
}
