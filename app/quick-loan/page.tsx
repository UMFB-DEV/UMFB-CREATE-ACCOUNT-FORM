import Image from 'next/image';
import QuickLoanApplicationForm from '@/components/QuickLoanApplicationForm';

export default function QuickLoanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full">
            <Image
              src="/Untitled-design-28.png"
              alt="UMFB Logo"
              height={84}
              width={94}
              className="w-96 h-48 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 -mt-8">
            Quick Loan Application
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Apply for a quick loan with UNILAG Microfinance Bank
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-[#ACD23C] to-[#7B3434] rounded-full mx-auto"></div>
        </div>
        <QuickLoanApplicationForm />
      </div>
    </div>
  );
}
