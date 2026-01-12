/**
 * Core image slicing logic for X/Twitter 4-image grid posts
 */

/**
 * Creates an image element from a source URL
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>}
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
 * Gets the cropped image data based on crop parameters
 * @param {string} imageSrc - Source image URL
 * @param {Object} pixelCrop - Crop coordinates {x, y, width, height}
 * @returns {Promise<ImageData>}
 */
export const getCroppedImg = async (imageSrc, pixelCrop) => {
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
 * Slices a cropped canvas into 4 quadrants (basic mode)
 * @param {HTMLCanvasElement} croppedCanvas - The cropped 16:9 image canvas
 * @returns {Promise<Blob[]>} - Array of 4 image blobs [TL, TR, BL, BR]
 */
export const sliceIntoQuadrants = async (croppedCanvas) => {
  const width = croppedCanvas.width;
  const height = croppedCanvas.height;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const quadrants = [
    { x: 0, y: 0, w: halfWidth, h: halfHeight },           // Top-Left
    { x: halfWidth, y: 0, w: halfWidth, h: halfHeight },   // Top-Right
    { x: 0, y: halfHeight, w: halfWidth, h: halfHeight },  // Bottom-Left
    { x: halfWidth, y: halfHeight, w: halfWidth, h: halfHeight }, // Bottom-Right
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
 * Creates vertical reveal images from a cropped canvas
 * Each quadrant is placed at the center of a taller canvas
 * X will center-crop these in the grid, showing the seamless preview
 * When opened, the full vertical image is revealed
 * 
 * @param {HTMLCanvasElement} croppedCanvas - The cropped 16:9 image canvas
 * @param {string} originalImageSrc - Original image source for extended content
 * @param {Object} pixelCrop - Original crop coordinates
 * @param {number} verticalRatio - Height multiplier for vertical canvas (default 2.5)
 * @returns {Promise<Blob[]>} - Array of 4 vertical image blobs
 */
export const sliceVerticalReveal = async (
  croppedCanvas,
  originalImageSrc,
  pixelCrop,
  verticalRatio = 2.5
) => {
  const image = await loadImage(originalImageSrc);
  
  const cropWidth = croppedCanvas.width;
  const cropHeight = croppedCanvas.height;
  const halfWidth = cropWidth / 2;
  const halfHeight = cropHeight / 2;

  // Output canvas dimensions - each quadrant becomes a tall vertical image
  const outputWidth = halfWidth;
  const outputHeight = halfHeight * verticalRatio;
  
  // How much extra height we're adding above and below
  const extraHeight = (outputHeight - halfHeight) / 2;
  
  // Scale factor between crop canvas and original image
  const scaleX = pixelCrop.width / cropWidth;
  const scaleY = pixelCrop.height / cropHeight;

  const quadrantPositions = [
    { cropX: 0, cropY: 0 },                    // Top-Left
    { cropX: halfWidth, cropY: 0 },            // Top-Right
    { cropX: 0, cropY: halfHeight },           // Bottom-Left
    { cropX: halfWidth, cropY: halfHeight },   // Bottom-Right
  ];

  const blobs = await Promise.all(
    quadrantPositions.map(async (pos, index) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Fill with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Calculate the source region in the original image
      const srcX = pixelCrop.x + (pos.cropX * scaleX);
      const srcY = pixelCrop.y + (pos.cropY * scaleY);
      const srcW = halfWidth * scaleX;
      const srcH = halfHeight * scaleY;

      // Calculate extended source region (with content above and below)
      const extraSrcHeight = extraHeight * scaleY;
      const extendedSrcY = srcY - extraSrcHeight;
      const extendedSrcH = srcH + (extraSrcHeight * 2);

      // Calculate how much of the extended region is within the image bounds
      const clampedSrcY = Math.max(0, extendedSrcY);
      const clampedSrcBottom = Math.min(image.height, extendedSrcY + extendedSrcH);
      const clampedSrcH = clampedSrcBottom - clampedSrcY;

      // Calculate destination offset based on clamped source
      const destYOffset = (clampedSrcY - extendedSrcY) / scaleY;
      const destH = clampedSrcH / scaleY;

      // Draw the extended image content
      if (clampedSrcH > 0) {
        ctx.drawImage(
          image,
          srcX, clampedSrcY, srcW, clampedSrcH,
          0, destYOffset, outputWidth, destH
        );
      }

      // Add subtle gradient overlays at top/bottom if content was clipped
      if (clampedSrcY > extendedSrcY) {
        // Top was clipped - add fade
        const gradient = ctx.createLinearGradient(0, 0, 0, extraHeight);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, outputWidth, extraHeight);
      }

      if (clampedSrcBottom < extendedSrcY + extendedSrcH) {
        // Bottom was clipped - add fade
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
 * Main function to process an image and create sliced outputs
 * @param {string} imageSrc - Source image URL
 * @param {Object} pixelCrop - Crop coordinates from react-easy-crop
 * @param {boolean} verticalMode - Whether to create vertical reveal images
 * @returns {Promise<Blob[]>} - Array of 4 image blobs ready for download
 */
export const processImage = async (imageSrc, pixelCrop, verticalMode = true) => {
  const croppedCanvas = await getCroppedImg(imageSrc, pixelCrop);
  
  if (verticalMode) {
    return sliceVerticalReveal(croppedCanvas, imageSrc, pixelCrop);
  } else {
    return sliceIntoQuadrants(croppedCanvas);
  }
};

/**
 * Creates data URLs for preview purposes
 * @param {Blob[]} blobs - Array of image blobs
 * @returns {Promise<string[]>} - Array of data URLs
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
