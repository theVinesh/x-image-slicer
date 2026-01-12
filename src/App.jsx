import { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageCropper from './components/ImageCropper';
import PreviewGrid from './components/PreviewGrid';
import DownloadButton from './components/DownloadButton';
import { processImage, blobsToDataUrls } from './utils/imageSlicing';

const STEPS = {
  UPLOAD: 'upload',
  CROP: 'crop',
  PREVIEW: 'preview',
};

export default function App() {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageName, setImageName] = useState('');
  const [cropData, setCropData] = useState(null);
  const [processedImages, setProcessedImages] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verticalMode, setVerticalMode] = useState(true);

  const handleImageSelected = useCallback((src, name) => {
    setImageSrc(src);
    setImageName(name.replace(/\.[^/.]+$/, '')); // Remove extension
    setStep(STEPS.CROP);
  }, []);

  const handleCropComplete = useCallback(async (pixelCrop) => {
    setCropData(pixelCrop);
    setStep(STEPS.PREVIEW);
    setIsProcessing(true);

    try {
      const blobs = await processImage(imageSrc, pixelCrop, verticalMode);
      setProcessedImages(blobs);
      
      const urls = await blobsToDataUrls(blobs);
      setImageUrls(urls);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, verticalMode]);

  const handleBack = useCallback(() => {
    if (step === STEPS.CROP) {
      setStep(STEPS.UPLOAD);
      setImageSrc(null);
    } else if (step === STEPS.PREVIEW) {
      setStep(STEPS.CROP);
      setProcessedImages(null);
      setImageUrls(null);
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setStep(STEPS.UPLOAD);
    setImageSrc(null);
    setImageName('');
    setCropData(null);
    setProcessedImages(null);
    setImageUrls(null);
  }, []);

  return (
    <div className="min-h-screen bg-x-black">
      {/* Header */}
      <header className="border-b border-x-border bg-x-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-x-blue flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-x-text">X Image Slicer</h1>
                <p className="text-xs text-x-secondary">Create seamless grid posts</p>
              </div>
            </div>

            {step !== STEPS.UPLOAD && (
              <button
                onClick={handleReset}
                className="text-sm text-x-secondary hover:text-x-text transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { key: STEPS.UPLOAD, label: 'Upload', num: 1 },
            { key: STEPS.CROP, label: 'Crop', num: 2 },
            { key: STEPS.PREVIEW, label: 'Download', num: 3 },
          ].map((s, index) => (
            <div key={s.key} className="flex items-center">
              <div className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                ${step === s.key 
                  ? 'bg-x-blue text-white' 
                  : Object.values(STEPS).indexOf(step) > Object.values(STEPS).indexOf(s.key)
                    ? 'bg-x-gray text-x-text'
                    : 'bg-x-gray/50 text-x-secondary'
                }
              `}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {Object.values(STEPS).indexOf(step) > Object.values(STEPS).indexOf(s.key) ? '✓' : s.num}
                </span>
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {index < 2 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  Object.values(STEPS).indexOf(step) > index ? 'bg-x-blue' : 'bg-x-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <main className="pb-12">
          {step === STEPS.UPLOAD && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-x-text mb-2">
                  Create Viral X Grid Posts
                </h2>
                <p className="text-x-secondary max-w-md mx-auto">
                  Upload an image and we'll split it into 4 pieces that form a seamless 
                  panorama in the X timeline.
                </p>
              </div>
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          )}

          {step === STEPS.CROP && imageSrc && (
            <div className="animate-fadeIn">
              {/* Vertical Mode Toggle */}
              <div className="max-w-4xl mx-auto mb-4">
                <label className="flex items-center gap-3 p-4 rounded-xl bg-x-gray/50 border border-x-border cursor-pointer hover:bg-x-gray/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={verticalMode}
                    onChange={(e) => setVerticalMode(e.target.checked)}
                    className="w-5 h-5 rounded border-x-border bg-x-dark text-x-blue focus:ring-x-blue focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-x-text">Vertical Reveal Mode</span>
                    <p className="text-xs text-x-secondary mt-0.5">
                      Creates taller images that reveal more content when tapped on X
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-x-blue/20 text-x-blue font-medium">
                    Recommended
                  </span>
                </label>
              </div>
              
              <ImageCropper
                imageSrc={imageSrc}
                onCropComplete={handleCropComplete}
                onBack={handleBack}
              />
            </div>
          )}

          {step === STEPS.PREVIEW && (
            <div className="animate-fadeIn space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-x-text mb-2">
                  Preview & Download
                </h2>
                <p className="text-x-secondary">
                  Your images are ready! Preview how they'll appear on X.
                </p>
              </div>

              <PreviewGrid 
                imageUrls={imageUrls} 
                isLoading={isProcessing} 
              />

              <DownloadButton 
                imageBlobs={processedImages}
                filename={imageName || 'x-grid-images'}
                disabled={isProcessing}
              />

              <div className="flex justify-center">
                <button
                  onClick={handleBack}
                  className="text-sm text-x-secondary hover:text-x-text transition-colors"
                >
                  ← Adjust crop
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-x-border py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-x-secondary text-sm">
            100% client-side • No uploads to any server • Your images stay private
          </p>
        </div>
      </footer>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
