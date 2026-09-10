import Image from 'next/image';
import { AtmApplicationForm } from '@/components/AtmApplicationForm';

export default function AtmApplicationPage() {
  return (
    <main className="min-h-screen w-full bg-white px-4 pb-12">
      <div className="w-full py-4 text-center">
        <div className="inline-flex items-center justify-center rounded-full">
          <Image src="/Untitled-design-28.png" alt="UMFB Logo" height={84} width={94} className="h-24 w-48 object-contain" priority />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">ATM Card Application</h1>
        <p className="text-lg font-medium text-gray-600">Apply for an ATM card with UNILAG Microfinance Bank</p>
        <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-gradient-to-r from-[#ACD23C] to-[#7B3434]" />
      </div>
      <AtmApplicationForm />
    </main>
  );
}
