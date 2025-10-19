
import React, { useState, useCallback } from 'react';
import type { UploadedFile } from '../types';

interface ImageUploaderProps {
  label: string;
  id: string;
  onImageUpload: (file: UploadedFile | null) => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, id }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const [header, base64Data] = dataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        
        onImageUpload({
          base64: base64Data,
          mimeType,
          dataUrl,
        });
        setPreviewUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      onImageUpload(null);
      setPreviewUrl(null);
    }
  }, [onImageUpload]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="aspect-square w-full bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden transition-colors hover:border-cyan-500">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon/>
            <p className="mt-2">Click to upload</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
