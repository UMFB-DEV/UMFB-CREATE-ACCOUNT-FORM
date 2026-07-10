import { MultiStepForm } from "@/components/MultiStepForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="text-center py-4 w-full">
        <div className="inline-flex items-center justify-center rounded-full ">
          {/*   <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg> */}
          <Image
            src="/Untitled-design-28.png"
            alt="sds"
            height={84}
            width={94}
            className="w-48 h-24 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Opening Form
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Open an account with us
        </p>
        <div className="mt-2 w-20 h-1 bg-gradient-to-r from-[#ACD23C] to-[#7B3434] rounded-full mx-auto"></div>
      </div>
      <MultiStepForm />
    </div>
  );
}
