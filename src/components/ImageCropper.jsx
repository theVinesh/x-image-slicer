import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

/**
 * Image cropper with 16:9 aspect ratio lock
 * This crop area will become the seamless timeline preview on X
 */
export default function ImageCropper({ 
  imageSrc, 
  onCropComplete, 
  onBack 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((newCrop) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Instructions */}
      <div className="mb-4 p-4 rounded-xl bg-x-gray/50 border border-x-border">
        <p className="text-sm text-x-text">
          <span className="text-x-blue font-semibold">Step 2:</span> Adjust the crop area. 
          This 16:9 region will appear as the seamless preview in your X timeline.
        </p>
      </div>

      {/* Cropper Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-x-dark border border-x-border">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
          cropShape="rect"
          showGrid={true}
          style={{
            containerStyle: {
              background: '#0f0f0f',
            },
            cropAreaStyle: {
              border: '2px solid #1d9bf0',
            },
          }}
        />
      </div>

      {/* Zoom Control */}
      <div className="mt-4 flex items-center gap-4">
        <span className="text-x-secondary text-sm">Zoom</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="
            flex-1 h-1 bg-x-border rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-x-blue
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
          "
        />
        <span className="text-x-secondary text-sm w-12">{zoom.toFixed(1)}x</span>
      </div>

      {/* Grid Preview Hint */}
      <div className="mt-4 p-3 rounded-lg bg-x-blue/10 border border-x-blue/30">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-x-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <p className="text-x-text font-medium">How the grid works on X:</p>
            <p className="text-x-secondary mt-1">
              The cropped area will be split into 4 images. In your timeline, they'll form one seamless picture. 
              When someone clicks to view, they'll see extended content above and below each section.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="
            px-6 py-2.5 rounded-full font-bold
            border border-x-border text-x-text
            hover:bg-x-gray transition-colors duration-200
          "
        >
          ← Back
        </button>
        <button
          onClick={handleConfirm}
          className="
            flex-1 px-6 py-2.5 rounded-full font-bold
            bg-x-blue hover:bg-x-blue-hover text-white
            transition-colors duration-200
          "
        >
          Continue to Preview →
        </button>
      </div>
    </div>
  );
}
