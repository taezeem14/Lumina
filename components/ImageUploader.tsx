import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="w-full h-96 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm transition-all hover:border-primary-500 dark:hover:border-primary-500 group cursor-pointer relative overflow-hidden"
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDragLeave={preventDefaults}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="z-10 flex flex-col items-center space-y-4 text-center p-8">
        <div className="w-20 h-20 bg-primary-100 dark:bg-dark-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Upload an Image</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
          Drag and drop your photo here, or click to browse from your device.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Supports JPG, PNG, WEBP
        </p>
        
        <label className="mt-4 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-lg hover:shadow-primary-500/30 transition-all cursor-pointer">
          Browse Files
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;