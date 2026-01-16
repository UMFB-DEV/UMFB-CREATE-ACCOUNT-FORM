import { UseFormReturn } from 'react-hook-form';
import { ContactForm } from '@/lib/validation';

interface FileUploadsStepProps {
  form: UseFormReturn<ContactForm>;
}

export function FileUploadsStep({ form }: FileUploadsStepProps) {
  const { register, setValue, watch, formState: { errors } } = form;

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
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Please upload the required documents. Maximum file size: 5MB each.
          Accepted formats: Images (JPEG, JPG, PNG) and Documents (PDF).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID Document */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Document *
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('idDocument', e)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {watchedFiles.idDocument && (
              <div className="text-sm text-gray-600">
                Selected: {watchedFiles.idDocument.name} ({formatFileSize(watchedFiles.idDocument.size)})
              </div>
            )}
          </div>
          {errors.idDocument && (
            <p className="mt-1 text-sm text-red-600">{errors.idDocument.message}</p>
          )}
        </div>

        {/* Passport Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Photo *
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('passportPhoto', e)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {watchedFiles.passportPhoto && (
              <div className="text-sm text-gray-600">
                Selected: {watchedFiles.passportPhoto.name} ({formatFileSize(watchedFiles.passportPhoto.size)})
              </div>
            )}
          </div>
          {errors.passportPhoto && (
            <p className="mt-1 text-sm text-red-600">{errors.passportPhoto.message}</p>
          )}
        </div>

        {/* Signature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature *
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('signature', e)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {watchedFiles.signature && (
              <div className="text-sm text-gray-600">
                Selected: {watchedFiles.signature.name} ({formatFileSize(watchedFiles.signature.size)})
              </div>
            )}
          </div>
          {errors.signature && (
            <p className="mt-1 text-sm text-red-600">{errors.signature.message}</p>
          )}
        </div>

        {/* Utility Bill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Utility Bill *
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('utilityBill', e)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {watchedFiles.utilityBill && (
              <div className="text-sm text-gray-600">
                Selected: {watchedFiles.utilityBill.name} ({formatFileSize(watchedFiles.utilityBill.size)})
              </div>
            )}
          </div>
          {errors.utilityBill && (
            <p className="mt-1 text-sm text-red-600">{errors.utilityBill.message}</p>
          )}
        </div>
      </div>

      {/* File Requirements Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-2">File Requirements:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All files are required</li>
          <li>• Maximum size: 5MB per file</li>
          <li>• Images: JPEG, JPG, PNG formats</li>
          <li>• Documents: PDF, JPEG, JPG, PNG formats</li>
        </ul>
      </div>
    </div>
  );
}
