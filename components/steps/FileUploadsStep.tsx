import { UseFormReturn } from 'react-hook-form';
import { ContactForm } from '@/lib/validation';

interface FileUploadsStepProps {
  form: UseFormReturn<ContactForm>;
}

export function FileUploadsStep({ form }: FileUploadsStepProps) {
  const { setValue, watch, formState: { errors } } = form;

  const handleFileChange = (fieldName: keyof ContactForm, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(fieldName, file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const watchedFiles = {
    idDocument: watch('idDocument'),
    passportPhoto: watch('passportPhoto'),
    signature: watch('signature'),
    utilityBill: watch('utilityBill'),
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800 font-medium">
              Please upload the required documents. Maximum file size: 5MB each.
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Accepted formats: Images (JPEG, JPG, PNG) and Documents (PDF).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID Document */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            ID Document *
          </label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('idDocument', e)}
                className="w-full px-4 py-4 border-2 border-gray-200 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ACD23C] file:text-gray-800 hover:file:bg-[#9BB82A] transition-all duration-200 cursor-pointer"
              />
            </div>
            {watchedFiles.idDocument && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-green-800">
                  <span className="font-medium">{watchedFiles.idDocument.name}</span>
                  <span className="text-green-600 ml-1">({formatFileSize(watchedFiles.idDocument.size)})</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Passport Photo */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Passport Photo *
          </label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('passportPhoto', e)}
                className="w-full px-4 py-4 border-2 border-gray-200 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ACD23C] file:text-gray-800 hover:file:bg-[#9BB82A] transition-all duration-200 cursor-pointer"
              />
            </div>
            {watchedFiles.passportPhoto && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-green-800">
                  <span className="font-medium">{watchedFiles.passportPhoto.name}</span>
                  <span className="text-green-600 ml-1">({formatFileSize(watchedFiles.passportPhoto.size)})</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signature */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Signature *
          </label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('signature', e)}
                className="w-full px-4 py-4 border-2 border-gray-200 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ACD23C] file:text-gray-800 hover:file:bg-[#9BB82A] transition-all duration-200 cursor-pointer"
              />
            </div>
            {watchedFiles.signature && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-green-800">
                  <span className="font-medium">{watchedFiles.signature.name}</span>
                  <span className="text-green-600 ml-1">({formatFileSize(watchedFiles.signature.size)})</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Utility Bill */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Utility Bill *
          </label>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('utilityBill', e)}
                className="w-full px-4 py-4 border-2 border-gray-200 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ACD23C] file:text-gray-800 hover:file:bg-[#9BB82A] transition-all duration-200 cursor-pointer"
              />
            </div>
            {watchedFiles.utilityBill && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-green-800">
                  <span className="font-medium">{watchedFiles.utilityBill.name}</span>
                  <span className="text-green-600 ml-1">({formatFileSize(watchedFiles.utilityBill.size)})</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Requirements Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-[#ACD23C]/10 to-[#7B3434]/10 rounded-xl border border-[#ACD23C]/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 text-[#7B3434] mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          File Requirements:
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center">
            <svg className="w-4 h-4 text-[#7B3434] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            All files are required
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-[#7B3434] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Maximum size: 5MB per file
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-[#7B3434] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Images: JPEG, JPG, PNG formats
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-[#7B3434] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Documents: PDF, JPEG, JPG, PNG formats
          </li>
        </ul>
      </div>
    </div>
  );
}
