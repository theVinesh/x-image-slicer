import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';

const ASPECT_RATIOS = {
  landscape: {
    value: 16 / 9,
    label: 'Landscape (16:9)',
    description: 'Seamless panorama on timeline',
    icon: '🖼️',
  },
  portrait: {
    value: 9 / 16,
    label: 'Portrait (9:16)',
    description: 'Stacked reveal when swiped',
    icon: '📱',
  },
};

/**
 * Image cropper with switchable aspect ratios
 * - Landscape (16:9): For seamless timeline panoramas
 * - Portrait (9:16): For stacked reveal effect
 */
export default function ImageCropper({ 
  imageSrc, 
  onCropComplete, 
  onBack 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectMode, setAspectMode] = useState('portrait'); // Default to portrait for the viral effect
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Reset crop position when aspect ratio changes
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, [aspectMode]);

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
      onCropComplete(croppedAreaPixels, aspectMode);
    }
  };

  const currentAspect = ASPECT_RATIOS[aspectMode];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mode Selector */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {Object.entries(ASPECT_RATIOS).map(([key, ratio]) => (
          <button
            key={key}
            onClick={() => setAspectMode(key)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${aspectMode === key 
                ? 'border-x-blue bg-x-blue/10' 
                : 'border-x-border hover:border-x-secondary bg-x-gray/30'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ratio.icon}</span>
              <div>
                <p className={`font-semibold ${aspectMode === key ? 'text-x-blue' : 'text-x-text'}`}>
                  {ratio.label}
                </p>
                <p className="text-xs text-x-secondary">{ratio.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mode Explanation */}
      <div className={`mb-4 p-4 rounded-xl border ${
        aspectMode === 'portrait' 
          ? 'bg-purple-500/10 border-purple-500/30' 
          : 'bg-x-blue/10 border-x-blue/30'
      }`}>
        {aspectMode === 'portrait' ? (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="text-xs text-purple-400 font-semibold mb-2">Timeline Grid:</div>
              <div className="grid grid-cols-2 gap-0.5 w-16">
                <div className="h-4 bg-purple-500/40 rounded-sm flex items-center justify-center text-[8px] text-purple-300">1</div>
                <div className="h-4 bg-purple-500/40 rounded-sm flex items-center justify-center text-[8px] text-purple-300">2</div>
                <div className="h-4 bg-purple-500/40 rounded-sm flex items-center justify-center text-[8px] text-purple-300">3</div>
                <div className="h-4 bg-purple-500/40 rounded-sm flex items-center justify-center text-[8px] text-purple-300">4</div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-xs text-purple-400 font-semibold mb-2">When Opened:</div>
              <div className="flex flex-col gap-0.5 w-10">
                <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">1</div>
                <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">2</div>
                <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">3</div>
                <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">4</div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-purple-200">
                <strong>Portrait Mode:</strong> Your image is split into 4 horizontal strips. 
                On timeline, they appear as a 2×2 grid. When someone taps and swipes through 
                1→2→3→4, the strips <strong>stack to reveal the full portrait!</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="text-xs text-x-blue font-semibold mb-2">Timeline Grid:</div>
              <div className="grid grid-cols-2 gap-0.5 w-20">
                <div className="h-5 bg-x-blue/40 rounded-sm"></div>
                <div className="h-5 bg-x-blue/40 rounded-sm"></div>
                <div className="h-5 bg-x-blue/40 rounded-sm"></div>
                <div className="h-5 bg-x-blue/40 rounded-sm"></div>
              </div>
              <div className="text-[8px] text-x-blue mt-1 text-center">Seamless!</div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-200">
                <strong>Landscape Mode:</strong> Your image is split into 4 quadrants that form 
                a <strong>seamless panorama</strong> in the timeline. When tapped, each image 
                reveals extended content above/below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cropper Container */}
      <div className={`relative w-full rounded-xl overflow-hidden bg-x-dark border border-x-border ${
        aspectMode === 'portrait' ? 'aspect-[9/16] max-h-[70vh]' : 'aspect-video'
      }`}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={currentAspect.value}
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
              border: aspectMode === 'portrait' ? '2px solid #a855f7' : '2px solid #1d9bf0',
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
          className={`
            flex-1 h-1 bg-x-border rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            ${aspectMode === 'portrait' 
              ? '[&::-webkit-slider-thumb]:bg-purple-500' 
              : '[&::-webkit-slider-thumb]:bg-x-blue'
            }
          `}
        />
        <span className="text-x-secondary text-sm w-12">{zoom.toFixed(1)}x</span>
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
          className={`
            flex-1 px-6 py-2.5 rounded-full font-bold text-white
            transition-colors duration-200
            ${aspectMode === 'portrait'
              ? 'bg-purple-500 hover:bg-purple-600'
              : 'bg-x-blue hover:bg-x-blue-hover'
            }
          `}
        >
          Continue to Preview →
        </button>
      </div>
    </div>
  );
}
