/**
 * Core image slicing logic for X/Twitter 4-image grid posts
 * 
 * X's 4-image grid behavior:
 * - Images uploaded in order 1,2,3,4 appear as:
 *   [1][2]
 *   [3][4]
 * - When opened, user swipes through: 1 → 2 → 3 → 4
 * - Each cell in the grid is cropped to fit (roughly 1:1 or 4:5)
 * 
 * Two modes:
 * 1. LANDSCAPE (16:9): Splits into quadrants for seamless panorama
 * 2. PORTRAIT (9:16): Splits into horizontal strips for stacked reveal
 */

/**
 * Creates an image element from a source URL
 */
export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Detects if the crop area is portrait or landscape
 */
export const isPortraitCrop = (pixelCrop) => {
  return pixelCrop.height > pixelCrop.width;
};

/**
 * Gets the cropped image as a canvas
 */
export const getCroppedCanvas = async (imageSrc, pixelCrop) => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas;
};

/**
 * LANDSCAPE MODE: Slice into 4 quadrants
 * Creates seamless 2×2 grid on X timeline
 * 
 * Input: 16:9 crop
 * Output: 4 images arranged as quadrants
 * 
 * [TL][TR]  →  Upload order: 1,2,3,4
 * [BL][BR]
 */
export const sliceLandscapeQuadrants = async (croppedCanvas) => {
  const width = croppedCanvas.width;
  const height = croppedCanvas.height;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const quadrants = [
    { x: 0, y: 0, w: halfWidth, h: halfHeight },           // 1: Top-Left
    { x: halfWidth, y: 0, w: halfWidth, h: halfHeight },   // 2: Top-Right
    { x: 0, y: halfHeight, w: halfWidth, h: halfHeight },  // 3: Bottom-Left
    { x: halfWidth, y: halfHeight, w: halfWidth, h: halfHeight }, // 4: Bottom-Right
  ];

  const blobs = await Promise.all(
    quadrants.map(async (q) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = q.w;
      canvas.height = q.h;

      ctx.drawImage(
        croppedCanvas,
        q.x, q.y, q.w, q.h,
        0, 0, q.w, q.h
      );

      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });
    })
  );

  return blobs;
};

/**
 * LANDSCAPE MODE WITH VERTICAL EXTENSION
 * Same as quadrants but each is made taller for "reveal" effect
 * X center-crops in grid, showing seamless preview
 * When opened, full tall image is revealed
 */
export const sliceLandscapeWithReveal = async (
  croppedCanvas,
  originalImageSrc,
  pixelCrop,
  verticalMultiplier = 2.5
) => {
  const image = await loadImage(originalImageSrc);
  
  const cropWidth = croppedCanvas.width;
  const cropHeight = croppedCanvas.height;
  const halfWidth = cropWidth / 2;
  const halfHeight = cropHeight / 2;

  // Output: each quadrant becomes a tall vertical image
  const outputWidth = halfWidth;
  const outputHeight = halfHeight * verticalMultiplier;
  
  const extraHeight = (outputHeight - halfHeight) / 2;
  const scaleX = pixelCrop.width / cropWidth;
  const scaleY = pixelCrop.height / cropHeight;

  const positions = [
    { cropX: 0, cropY: 0 },                    // 1: Top-Left
    { cropX: halfWidth, cropY: 0 },            // 2: Top-Right
    { cropX: 0, cropY: halfHeight },           // 3: Bottom-Left
    { cropX: halfWidth, cropY: halfHeight },   // 4: Bottom-Right
  ];

  const blobs = await Promise.all(
    positions.map(async (pos) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      const srcX = pixelCrop.x + (pos.cropX * scaleX);
      const srcY = pixelCrop.y + (pos.cropY * scaleY);
      const srcW = halfWidth * scaleX;
      const srcH = halfHeight * scaleY;

      const extraSrcHeight = extraHeight * scaleY;
      const extendedSrcY = srcY - extraSrcHeight;
      const extendedSrcH = srcH + (extraSrcHeight * 2);

      const clampedSrcY = Math.max(0, extendedSrcY);
      const clampedSrcBottom = Math.min(image.height, extendedSrcY + extendedSrcH);
      const clampedSrcH = clampedSrcBottom - clampedSrcY;

      const destYOffset = (clampedSrcY - extendedSrcY) / scaleY;
      const destH = clampedSrcH / scaleY;

      if (clampedSrcH > 0) {
        ctx.drawImage(
          image,
          srcX, clampedSrcY, srcW, clampedSrcH,
          0, destYOffset, outputWidth, destH
        );
      }

      // Fade edges if clipped
      if (clampedSrcY > extendedSrcY) {
        const gradient = ctx.createLinearGradient(0, 0, 0, extraHeight);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, outputWidth, extraHeight);
      }

      if (clampedSrcBottom < extendedSrcY + extendedSrcH) {
        const gradient = ctx.createLinearGradient(0, outputHeight - extraHeight, 0, outputHeight);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, outputHeight - extraHeight, outputWidth, extraHeight);
      }

      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });
    })
  );

  return blobs;
};

/**
 * PORTRAIT MODE: Slice into 4 horizontal strips
 * 
 * When uploaded to X as 1,2,3,4:
 * - Grid shows: [Strip1][Strip2]
 *               [Strip3][Strip4]
 * - When swiped: 1→2→3→4 = top→upper→lower→bottom = COMPLETE IMAGE!
 * 
 * This is the "stacked reveal" effect - the images reconstruct
 * the full portrait when viewed in sequence.
 * 
 * Input: 9:16 crop (or any portrait)
 * Output: 4 horizontal strips
 */
export const slicePortraitStrips = async (croppedCanvas) => {
  const width = croppedCanvas.width;
  const height = croppedCanvas.height;
  const stripHeight = height / 4;

  // Create 4 horizontal strips from top to bottom
  // Upload order: 1,2,3,4 maps to grid positions TL,TR,BL,BR
  // But when swiped, order is 1→2→3→4 which reveals full image!
  const strips = [
    { x: 0, y: 0, w: width, h: stripHeight },                    // Strip 1: Top
    { x: 0, y: stripHeight, w: width, h: stripHeight },          // Strip 2: Upper-middle
    { x: 0, y: stripHeight * 2, w: width, h: stripHeight },      // Strip 3: Lower-middle
    { x: 0, y: stripHeight * 3, w: width, h: stripHeight },      // Strip 4: Bottom
  ];

  const blobs = await Promise.all(
    strips.map(async (strip) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = strip.w;
      canvas.height = strip.h;

      ctx.drawImage(
        croppedCanvas,
        strip.x, strip.y, strip.w, strip.h,
        0, 0, strip.w, strip.h
      );

      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });
    })
  );

  return blobs;
};

/**
 * PORTRAIT MODE WITH EXTENDED HEIGHT
 * Each strip is made taller to give more reveal content
 * X will center-crop these in the grid
 * When swiped, full height is shown
 */
export const slicePortraitWithReveal = async (
  croppedCanvas,
  originalImageSrc,
  pixelCrop,
  heightMultiplier = 1.5
) => {
  const image = await loadImage(originalImageSrc);
  
  const cropWidth = croppedCanvas.width;
  const cropHeight = croppedCanvas.height;
  const stripHeight = cropHeight / 4;
  
  // Output dimensions: each strip becomes taller
  const outputWidth = cropWidth;
  const outputHeight = stripHeight * heightMultiplier;
  
  const extraHeight = (outputHeight - stripHeight) / 2;
  const scaleX = pixelCrop.width / cropWidth;
  const scaleY = pixelCrop.height / cropHeight;

  const stripPositions = [
    { cropY: 0 },                    // Strip 1: Top
    { cropY: stripHeight },          // Strip 2: Upper-middle
    { cropY: stripHeight * 2 },      // Strip 3: Lower-middle
    { cropY: stripHeight * 3 },      // Strip 4: Bottom
  ];

  const blobs = await Promise.all(
    stripPositions.map(async (pos) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      const srcX = pixelCrop.x;
      const srcY = pixelCrop.y + (pos.cropY * scaleY);
      const srcW = cropWidth * scaleX;
      const srcH = stripHeight * scaleY;

      const extraSrcHeight = extraHeight * scaleY;
      const extendedSrcY = srcY - extraSrcHeight;
      const extendedSrcH = srcH + (extraSrcHeight * 2);

      const clampedSrcY = Math.max(0, extendedSrcY);
      const clampedSrcBottom = Math.min(image.height, extendedSrcY + extendedSrcH);
      const clampedSrcH = clampedSrcBottom - clampedSrcY;

      const destYOffset = (clampedSrcY - extendedSrcY) / scaleY;
      const destH = clampedSrcH / scaleY;

      if (clampedSrcH > 0) {
        ctx.drawImage(
          image,
          srcX, clampedSrcY, srcW, clampedSrcH,
          0, destYOffset, outputWidth, destH
        );
      }

      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });
    })
  );

  return blobs;
};

/**
 * Main processing function
 * Automatically detects orientation and applies appropriate slicing
 */
export const processImage = async (imageSrc, pixelCrop, extendedReveal = true) => {
  const croppedCanvas = await getCroppedCanvas(imageSrc, pixelCrop);
  const isPortrait = isPortraitCrop(pixelCrop);
  
  if (isPortrait) {
    // Portrait mode: horizontal strips for stacked reveal
    if (extendedReveal) {
      return slicePortraitWithReveal(croppedCanvas, imageSrc, pixelCrop);
    } else {
      return slicePortraitStrips(croppedCanvas);
    }
  } else {
    // Landscape mode: quadrants for seamless panorama
    if (extendedReveal) {
      return sliceLandscapeWithReveal(croppedCanvas, imageSrc, pixelCrop);
    } else {
      return sliceLandscapeQuadrants(croppedCanvas);
    }
  }
};

/**
 * Get metadata about the processing mode
 */
export const getProcessingMode = (pixelCrop) => {
  const isPortrait = isPortraitCrop(pixelCrop);
  return {
    isPortrait,
    mode: isPortrait ? 'portrait' : 'landscape',
    description: isPortrait 
      ? 'Horizontal strips - swipe to reveal full portrait'
      : 'Quadrant grid - seamless panorama on timeline',
    gridPreview: isPortrait
      ? 'Creative composite (strips in grid)'
      : 'Seamless panorama',
    openedView: isPortrait
      ? 'Swipe 1→2→3→4 reveals complete image'
      : 'Each quadrant with extended content',
  };
};

/**
 * Creates data URLs for preview purposes
 */
export const blobsToDataUrls = async (blobs) => {
  return Promise.all(
    blobs.map((blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    })
  );
};
