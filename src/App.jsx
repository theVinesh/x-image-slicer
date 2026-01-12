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
  const [aspectMode, setAspectMode] = useState('portrait');
  const [processedImages, setProcessedImages] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelected = useCallback((src, name) => {
    setImageSrc(src);
    setImageName(name.replace(/\.[^/.]+$/, ''));
    setStep(STEPS.CROP);
  }, []);

  const handleCropComplete = useCallback(async (pixelCrop, mode) => {
    setAspectMode(mode);
    setStep(STEPS.PREVIEW);
    setIsProcessing(true);

    try {
      // Process with extended reveal enabled
      const blobs = await processImage(imageSrc, pixelCrop, true);
      setProcessedImages(blobs);
      
      const urls = await blobsToDataUrls(blobs);
      setImageUrls(urls);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc]);

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
    setAspectMode('portrait');
    setProcessedImages(null);
    setImageUrls(null);
  }, []);

  const isPortrait = aspectMode === 'portrait';

  return (
    <div className="min-h-screen bg-x-black">
      {/* Header */}
      <header className="border-b border-x-border bg-x-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isPortrait ? 'bg-purple-500' : 'bg-x-blue'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-x-text">X Image Slicer</h1>
                <p className="text-xs text-x-secondary">Create viral grid posts</p>
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
      <div className="max-w-5xl mx-auto px-4 py-6">
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
                  ? isPortrait ? 'bg-purple-500 text-white' : 'bg-x-blue text-white'
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
                  Object.values(STEPS).indexOf(step) > index 
                    ? isPortrait ? 'bg-purple-500' : 'bg-x-blue' 
                    : 'bg-x-border'
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
                <p className="text-x-secondary max-w-lg mx-auto">
                  Upload an image and we'll split it into 4 pieces for X's 2×2 grid. 
                  Choose <strong className="text-purple-400">Portrait</strong> for stacked reveals 
                  or <strong className="text-x-blue">Landscape</strong> for seamless panoramas.
                </p>
              </div>

              {/* Effect Examples */}
              <div className="max-w-2xl mx-auto mb-8 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📱</span>
                    <span className="font-semibold text-purple-400">Portrait Mode</span>
                  </div>
                  <p className="text-sm text-x-secondary mb-3">
                    4 horizontal strips that stack when swiped to reveal a full portrait
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[10px] text-purple-400 mb-1">Timeline</div>
                      <div className="grid grid-cols-2 gap-0.5 w-12">
                        <div className="h-3 bg-purple-500/40 rounded-sm"></div>
                        <div className="h-3 bg-purple-500/40 rounded-sm"></div>
                        <div className="h-3 bg-purple-500/40 rounded-sm"></div>
                        <div className="h-3 bg-purple-500/40 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="text-x-secondary">→</div>
                    <div>
                      <div className="text-[10px] text-purple-400 mb-1">Opened</div>
                      <div className="flex flex-col gap-0.5 w-6">
                        <div className="h-2 bg-purple-500/60 rounded-sm"></div>
                        <div className="h-2 bg-purple-500/60 rounded-sm"></div>
                        <div className="h-2 bg-purple-500/60 rounded-sm"></div>
                        <div className="h-2 bg-purple-500/60 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-x-blue/10 border border-x-blue/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🖼️</span>
                    <span className="font-semibold text-x-blue">Landscape Mode</span>
                  </div>
                  <p className="text-sm text-x-secondary mb-3">
                    4 quadrants that form a seamless panorama on the timeline
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[10px] text-x-blue mb-1">Timeline</div>
                      <div className="grid grid-cols-2 gap-0.5 w-16">
                        <div className="h-4 bg-x-blue/40 rounded-sm"></div>
                        <div className="h-4 bg-x-blue/40 rounded-sm"></div>
                        <div className="h-4 bg-x-blue/40 rounded-sm"></div>
                        <div className="h-4 bg-x-blue/40 rounded-sm"></div>
                      </div>
                      <div className="text-[8px] text-x-blue mt-1">Seamless!</div>
                    </div>
                  </div>
                </div>
              </div>

              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          )}

          {step === STEPS.CROP && imageSrc && (
            <div className="animate-fadeIn">
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
                  {isPortrait ? '📱 Portrait Mode' : '🖼️ Landscape Mode'}
                </h2>
                <p className="text-x-secondary">
                  {isPortrait 
                    ? 'Your image will stack to reveal the full portrait when swiped!'
                    : 'Your image will appear as a seamless panorama in the timeline!'
                  }
                </p>
              </div>

              <PreviewGrid 
                imageUrls={imageUrls} 
                isLoading={isProcessing}
                mode={aspectMode}
              />

              <DownloadButton 
                imageBlobs={processedImages}
                filename={imageName || 'x-grid-images'}
                disabled={isProcessing}
                mode={aspectMode}
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
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="text-x-secondary text-sm">
            100% client-side • No uploads to any server • Your images stay private
          </p>
          <p className="text-x-secondary text-sm">
            Prompted into existence by{' '}
            <a 
              href="https://thevinesh.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-x-blue hover:text-x-blue-hover transition-colors underline"
            >
              Vinesh
            </a>
          </p>
        </div>
      </footer>

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
