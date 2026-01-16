import { MultiStepForm } from '@/components/MultiStepForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#7B3434] rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Account Opening Form
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Open an account with us
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-[#ACD23C] to-[#7B3434] rounded-full mx-auto"></div>
        </div>
        <MultiStepForm />
      </div>
    </div>
  );
}
