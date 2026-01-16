import { MultiStepForm } from '@/components/MultiStepForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Opening Form
          </h1>
          <p className="text-gray-600">
            Please fill out all required information to open your Regular Savings Account
          </p>
        </div>
        <MultiStepForm />
      </div>
    </div>
  );
}
