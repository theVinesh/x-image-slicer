import { useState } from 'react';
import { downloadAsZip } from '../utils/zipGenerator';

/**
 * Download button component with ZIP generation
 */
export default function DownloadButton({ 
  imageBlobs, 
  filename = 'x-grid-images',
  disabled = false,
  mode = 'portrait'
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!imageBlobs || imageBlobs.length !== 4 || isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadAsZip(imageBlobs, filename, mode);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const isPortrait = mode === 'portrait';

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleDownload}
        disabled={disabled || isDownloading || !imageBlobs}
        className={`
          w-full px-8 py-4 rounded-full font-bold text-lg
          flex items-center justify-center gap-3
          transition-all duration-200
          ${disabled || !imageBlobs
            ? 'bg-x-gray text-x-secondary cursor-not-allowed'
            : isPortrait
              ? 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-x-blue hover:bg-x-blue-hover text-white hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isDownloading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Creating ZIP...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download ZIP</span>
          </>
        )}
      </button>

      {/* Upload Instructions */}
      <div className={`mt-6 p-4 rounded-xl border ${
        isPortrait ? 'bg-purple-500/10 border-purple-500/30' : 'bg-x-blue/10 border-x-blue/30'
      }`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
          isPortrait ? 'text-purple-400' : 'text-x-blue'
        }`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          How to post on X:
        </h3>
        <ol className="text-sm text-x-secondary space-y-2">
          <li className="flex gap-2">
            <span className={`font-bold ${isPortrait ? 'text-purple-400' : 'text-x-blue'}`}>1.</span>
            <span>Extract the ZIP file</span>
          </li>
          <li className="flex gap-2">
            <span className={`font-bold ${isPortrait ? 'text-purple-400' : 'text-x-blue'}`}>2.</span>
            <span>Create a new post on X</span>
          </li>
          <li className="flex gap-2">
            <span className={`font-bold ${isPortrait ? 'text-purple-400' : 'text-x-blue'}`}>3.</span>
            <span>Click the image icon and select all 4 images</span>
          </li>
          <li className="flex gap-2">
            <span className={`font-bold ${isPortrait ? 'text-purple-400' : 'text-x-blue'}`}>4.</span>
            <span>
              <strong className="text-x-text">Important:</strong> Verify order is <code className="text-x-text bg-x-gray px-1 rounded">1, 2, 3, 4</code>
            </span>
          </li>
          <li className="flex gap-2">
            <span className={`font-bold ${isPortrait ? 'text-purple-400' : 'text-x-blue'}`}>5.</span>
            <span>Post and watch the magic! ✨</span>
          </li>
        </ol>

        {/* Visual guide */}
        <div className="mt-4 p-3 rounded-lg bg-x-dark border border-x-border">
          <div className="flex items-center justify-around">
            <div>
              <p className="text-xs text-x-secondary mb-2 text-center">Upload order</p>
              <div className="grid grid-cols-2 gap-1 w-20 mx-auto">
                <div className={`aspect-square rounded flex items-center justify-center text-sm font-bold text-white ${
                  isPortrait ? 'bg-purple-500/40' : 'bg-x-blue/40'
                }`}>1</div>
                <div className={`aspect-square rounded flex items-center justify-center text-sm font-bold text-white ${
                  isPortrait ? 'bg-purple-500/40' : 'bg-x-blue/40'
                }`}>2</div>
                <div className={`aspect-square rounded flex items-center justify-center text-sm font-bold text-white ${
                  isPortrait ? 'bg-purple-500/40' : 'bg-x-blue/40'
                }`}>3</div>
                <div className={`aspect-square rounded flex items-center justify-center text-sm font-bold text-white ${
                  isPortrait ? 'bg-purple-500/40' : 'bg-x-blue/40'
                }`}>4</div>
              </div>
            </div>
            
            <div className="text-x-secondary">→</div>
            
            <div>
              <p className="text-xs text-x-secondary mb-2 text-center">
                {isPortrait ? 'Swipe reveals' : 'Timeline shows'}
              </p>
              {isPortrait ? (
                <div className="flex flex-col gap-0.5 w-8 mx-auto">
                  <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">1</div>
                  <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">2</div>
                  <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">3</div>
                  <div className="h-4 bg-purple-500/60 rounded-sm flex items-center justify-center text-[8px] text-white">4</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-0.5 w-20">
                  <div className="h-6 bg-x-blue/60 rounded-sm"></div>
                  <div className="h-6 bg-x-blue/60 rounded-sm"></div>
                  <div className="h-6 bg-x-blue/60 rounded-sm"></div>
                  <div className="h-6 bg-x-blue/60 rounded-sm"></div>
                </div>
              )}
              <p className={`text-[8px] mt-1 text-center ${isPortrait ? 'text-purple-400' : 'text-x-blue'}`}>
                {isPortrait ? 'Full image!' : 'Seamless!'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode-specific tip */}
        <div className={`mt-3 p-2 rounded text-xs ${
          isPortrait ? 'bg-purple-500/20 text-purple-300' : 'bg-x-blue/20 text-blue-300'
        }`}>
          {isPortrait ? (
            <p>💡 <strong>Pro tip:</strong> Add a caption like "Swipe to see the full picture 👀" to encourage engagement!</p>
          ) : (
            <p>💡 <strong>Pro tip:</strong> The seamless effect works best with landscape photos or panoramas!</p>
          )}
        </div>
      </div>
    </div>
  );
}
