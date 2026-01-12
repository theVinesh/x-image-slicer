import { useState } from 'react';

/**
 * X-style preview component
 * Shows both timeline view (2×2 grid) and opened view (stacked)
 */
export default function PreviewGrid({ 
  imageUrls, 
  isLoading = false,
  mode = 'portrait' // 'portrait' or 'landscape'
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showStackedPreview, setShowStackedPreview] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="aspect-video rounded-2xl bg-x-gray border border-x-border flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${
              mode === 'portrait' ? 'border-purple-500' : 'border-x-blue'
            }`} />
            <p className="text-x-secondary text-sm">Processing images...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!imageUrls || imageUrls.length !== 4) {
    return null;
  }

  const isPortrait = mode === 'portrait';
  const accentColor = isPortrait ? 'purple' : 'blue';

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-full bg-x-gray p-1 border border-x-border">
          <button
            onClick={() => setShowStackedPreview(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !showStackedPreview 
                ? isPortrait ? 'bg-purple-500 text-white' : 'bg-x-blue text-white'
                : 'text-x-secondary hover:text-x-text'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setShowStackedPreview(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              showStackedPreview 
                ? isPortrait ? 'bg-purple-500 text-white' : 'bg-x-blue text-white'
                : 'text-x-secondary hover:text-x-text'
            }`}
          >
            Opened View
          </button>
        </div>
      </div>

      {!showStackedPreview ? (
        /* Timeline Preview - 2×2 Grid */
        <div>
          <div className="mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-x-secondary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-sm text-x-secondary">How it appears in the timeline</span>
          </div>

          {/* Mock X Post */}
          <div className="rounded-2xl border border-x-border bg-x-dark p-4">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-x-gray"></div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-x-text text-sm">Your Name</span>
                  <svg className="w-4 h-4 text-x-blue" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                  </svg>
                </div>
                <span className="text-x-secondary text-xs">@yourhandle · now</span>
              </div>
            </div>

            {/* Post Text */}
            <p className="text-x-text text-sm mb-3">Check this out!</p>

            {/* Image Grid */}
            <div className="rounded-2xl overflow-hidden border border-x-border">
              <div className="grid grid-cols-2 gap-0.5 bg-x-border">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`relative bg-x-dark cursor-pointer overflow-hidden group ${
                      isPortrait ? 'aspect-square' : 'aspect-[8/4.5]'
                    }`}
                    onClick={() => setExpandedIndex(index)}
                  >
                    <img
                      src={url}
                      alt={`Grid image ${index + 1}`}
                      className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Opened/Stacked View */
        <div>
          <div className="mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-x-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm text-x-secondary">
              When someone taps to view (swipe 1→2→3→4)
            </span>
          </div>

          {/* Stacked Images Preview */}
          <div className="bg-x-dark rounded-2xl border border-x-border p-4">
            <div className={`flex ${isPortrait ? 'flex-col' : 'flex-row flex-wrap'} gap-3 items-center justify-center`}>
              {imageUrls.map((url, index) => (
                <div 
                  key={index}
                  className={`relative rounded-xl overflow-hidden border border-x-border cursor-pointer hover:border-${accentColor}-500 transition-colors ${
                    isPortrait ? 'w-full max-w-xs' : 'w-40'
                  }`}
                  onClick={() => setExpandedIndex(index)}
                >
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-auto"
                  />
                  <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    isPortrait ? 'bg-purple-500' : 'bg-x-blue'
                  }`}>
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 grid grid-cols-4 gap-2 text-xs text-x-secondary">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded flex items-center justify-center font-mono ${
              isPortrait ? 'bg-purple-500/20 text-purple-400' : 'bg-x-blue/20 text-x-blue'
            }`}>{num}</span>
            <span>{isPortrait 
              ? ['Top', 'Upper', 'Lower', 'Bottom'][num - 1]
              : ['TL', 'TR', 'BL', 'BR'][num - 1]
            }</span>
          </div>
        ))}
      </div>

      {/* Expanded Image Modal */}
      {expandedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setExpandedIndex(null)}
        >
          <div className="relative max-w-lg w-full max-h-[90vh] overflow-auto">
            <button
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors z-10"
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
              Image {expandedIndex + 1} of 4
              {isPortrait && ` — ${['Top', 'Upper-middle', 'Lower-middle', 'Bottom'][expandedIndex]} strip`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
