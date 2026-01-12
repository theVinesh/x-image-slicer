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
            <p className="text-x-text text-sm mb-3">Check out this cool effect! ✨</p>

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

            {/* Post Actions */}
            <div className="flex justify-between mt-3 text-x-secondary">
              <button className="flex items-center gap-1 hover:text-x-blue transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs">24</span>
              </button>
              <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs">142</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs">1.2K</span>
              </button>
              <button className="flex items-center gap-1 hover:text-x-blue transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mode-specific explanation */}
          <div className={`mt-4 p-3 rounded-lg ${
            isPortrait ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-x-blue/10 border border-x-blue/30'
          }`}>
            <p className="text-sm text-x-secondary">
              {isPortrait ? (
                <>
                  <span className="text-purple-400 font-semibold">Portrait Mode:</span> The grid shows 4 horizontal strips. 
                  Tap any image to see how they stack when viewed!
                </>
              ) : (
                <>
                  <span className="text-x-blue font-semibold">Landscape Mode:</span> The 4 quadrants form a seamless panorama. 
                  Tap any image to see the extended reveal content.
                </>
              )}
            </p>
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

            {isPortrait && (
              <div className="mt-4 text-center">
                <p className="text-sm text-purple-400 font-medium">
                  ↑ Swipe through these to see the full portrait! ↑
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className={`mt-4 p-3 rounded-lg ${
            isPortrait ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-x-blue/10 border border-x-blue/30'
          }`}>
            <p className="text-sm text-x-secondary">
              {isPortrait ? (
                <>
                  <span className="text-purple-400 font-semibold">The Magic:</span> When a user swipes through 
                  images 1→2→3→4, the horizontal strips stack to reveal your complete portrait image! 
                  It's like a vertical puzzle that assembles as they scroll.
                </>
              ) : (
                <>
                  <span className="text-x-blue font-semibold">Extended Reveal:</span> Each quadrant has extra 
                  content above and below. The timeline shows the seamless crop, but tapping reveals more!
                </>
              )}
            </p>
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
