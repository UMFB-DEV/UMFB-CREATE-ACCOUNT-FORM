'use client';

import { useState, useRef, useEffect, memo } from 'react';

interface SignatureInputProps {
  label: string;
  value: File | string | null;
  onChange: (value: File | null) => void;
  required?: boolean;
}

export const SignatureInput = memo(function SignatureInput({
  label,
  value,
  onChange,
  required = false,
}: SignatureInputProps) {
  const [mode, setMode] = useState<'upload' | 'draw'>('upload');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === 'string') {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const getCanvasPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPositionRef.current = getCanvasPosition(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;

    const currentPosition = getCanvasPosition(e);
    if (!currentPosition || !lastPositionRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPositionRef.current = currentPosition;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPositionRef.current = null;
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'signature.png', { type: 'image/png' });
          onChange(file);
        }
      }, 'image/png');
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    onChange(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {required ? <span className="text-[#7B3434] ml-1">*</span> : null}
      </label>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${
            mode === 'upload'
              ? 'bg-[#7B3434] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition ${
            mode === 'draw'
              ? 'bg-[#7B3434] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Draw Signature
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full px-4 py-4 border-2 border-gray-200 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ACD23C] file:text-gray-800 hover:file:bg-[#9BB82A] transition-all duration-200 cursor-pointer"
            />
          </div>
          {previewUrl && value instanceof File && (
            <div className="space-y-3">
              <img
                src={previewUrl}
                alt="Signature preview"
                className="max-h-40 border border-gray-200 rounded-lg object-contain"
              />
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-green-800">
                    <span className="font-medium">{value.name}</span>
                    <span className="text-green-600 ml-1">
                      ({formatFileSize(value.size)})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="w-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <button
            type="button"
            onClick={clearCanvas}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition"
          >
            Clear Signature
          </button>
          {previewUrl && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Signature preview"
                className="max-h-40 border border-gray-200 rounded-lg object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});
