import { useState, useCallback } from 'react';

/**
 * Drag and drop image uploader component
 */
export default function ImageUploader({ onImageSelected }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  }, []);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12
          transition-all duration-200 ease-out cursor-pointer
          ${isDragging 
            ? 'border-x-blue bg-x-blue/10 scale-[1.02]' 
            : 'border-x-border hover:border-x-secondary hover:bg-x-gray/30'
          }
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4 text-center">
          {/* Upload Icon */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${isDragging ? 'bg-x-blue/20' : 'bg-x-gray'}
          `}>
            <svg 
              className={`w-8 h-8 transition-colors ${isDragging ? 'text-x-blue' : 'text-x-secondary'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>

          {/* Text */}
          <div>
            <p className={`text-lg font-medium transition-colors ${isDragging ? 'text-x-blue' : 'text-x-text'}`}>
              {isDragging ? 'Drop your image here' : 'Drop an image or click to upload'}
            </p>
            <p className="text-x-secondary text-sm mt-1">
              Supports JPG, PNG, WebP
            </p>
          </div>

          {/* Button */}
          <button
            type="button"
            className="
              mt-2 px-6 py-2.5 rounded-full font-bold
              bg-x-blue hover:bg-x-blue-hover text-white
              transition-colors duration-200
            "
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('file-input').click();
            }}
          >
            Select Image
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 rounded-xl bg-x-gray/50 border border-x-border">
        <h3 className="text-sm font-semibold text-x-text mb-2">💡 Tips for best results:</h3>
        <ul className="text-sm text-x-secondary space-y-1">
          <li>• Use high-resolution images (1920×1080 or larger)</li>
          <li>• Landscape or panoramic images work best</li>
          <li>• The 16:9 crop will become the seamless timeline preview</li>
        </ul>
      </div>
    </div>
  );
}
