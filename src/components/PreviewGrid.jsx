import { useState } from 'react';

/**
 * X-style 2x2 grid preview component
 * Shows how the images will appear in the X timeline
 */
export default function PreviewGrid({ 
  imageUrls, 
  isLoading = false 
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="aspect-video rounded-2xl bg-x-gray border border-x-border flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-x-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-x-secondary text-sm">Processing images...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!imageUrls || imageUrls.length !== 4) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Timeline Preview */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-x-secondary mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Timeline Preview
        </h3>
        <p className="text-xs text-x-secondary mb-3">
          This is how your post will appear in the feed
        </p>
      </div>

      {/* Grid Container - mimics X's 2x2 layout */}
      <div className="rounded-2xl overflow-hidden border border-x-border bg-x-dark">
        <div className="grid grid-cols-2 gap-0.5 bg-x-border">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-[8/4.5] bg-x-dark cursor-pointer overflow-hidden group"
              onClick={() => setExpandedIndex(index)}
            >
              <img
                src={url}
                alt={`Grid image ${index + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              {/* Position indicator */}
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-x-secondary">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-x-gray flex items-center justify-center font-mono">1</span>
          <span>Top-Left</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-x-gray flex items-center justify-center font-mono">2</span>
          <span>Top-Right</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-x-gray flex items-center justify-center font-mono">3</span>
          <span>Bottom-Left</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-x-gray flex items-center justify-center font-mono">4</span>
          <span>Bottom-Right</span>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedIndex(null)}
        >
          <div className="relative max-w-md w-full">
            <button
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              onClick={() => setExpandedIndex(null)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-x-dark rounded-2xl overflow-hidden border border-x-border">
              <img
                src={imageUrls[expandedIndex]}
                alt={`Expanded image ${expandedIndex + 1}`}
                className="w-full h-auto"
              />
            </div>
            <p className="text-center text-x-secondary text-sm mt-3">
              Image {expandedIndex + 1} - This is what users see when they tap to expand
            </p>
          </div>
        </div>
      )}

      {/* Vertical Stack Preview */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-x-secondary mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Expanded View (when clicked)
        </h3>
        <p className="text-xs text-x-secondary mb-3">
          Each image reveals more content when tapped
        </p>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageUrls.map((url, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-24 rounded-lg overflow-hidden border border-x-border cursor-pointer hover:border-x-blue transition-colors"
              onClick={() => setExpandedIndex(index)}
            >
              <img
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
