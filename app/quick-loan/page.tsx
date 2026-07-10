import Image from 'next/image';
import QuickLoanApplicationForm from '@/components/QuickLoanApplicationForm';

export default function QuickLoanPage() {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="text-center py-4 w-full">
        <div className="inline-flex items-center justify-center rounded-full">
          <Image
            src="/Untitled-design-28.png"
            alt="UMFB Logo"
            height={84}
            width={94}
            className="w-48 h-24 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quick Loan Application
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Apply for a quick loan with UNILAG Microfinance Bank
        </p>
        <div className="mt-2 w-20 h-1 bg-gradient-to-r from-[#ACD23C] to-[#7B3434] rounded-full mx-auto"></div>
      </div>
      <QuickLoanApplicationForm />
    </div>
  );
}
