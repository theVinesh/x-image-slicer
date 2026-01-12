import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Creates a ZIP file containing the 4 sliced images and triggers download
 * Images are named in upload order for X: 1.jpg, 2.jpg, 3.jpg, 4.jpg
 * 
 * @param {Blob[]} imageBlobs - Array of 4 image blobs
 * @param {string} filename - Name for the ZIP file (without extension)
 * @param {string} mode - 'portrait' or 'landscape'
 */
export const downloadAsZip = async (imageBlobs, filename = 'x-grid-images', mode = 'portrait') => {
  const zip = new JSZip();
  
  // Add images to ZIP with numbered names
  const imageNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
  
  imageBlobs.forEach((blob, index) => {
    zip.file(imageNames[index], blob);
  });

  // Add a readme with mode-specific instructions
  const isPortrait = mode === 'portrait';
  
  const readme = `X Image Slicer - Upload Instructions
=====================================
Mode: ${isPortrait ? 'PORTRAIT (Stacked Reveal)' : 'LANDSCAPE (Seamless Panorama)'}

HOW TO POST ON X:
-----------------
1. Open X (Twitter) and create a new post
2. Click the image/media icon
3. Select ALL 4 images at once (1.jpg through 4.jpg)
4. IMPORTANT: Verify they appear in order: 1, 2, 3, 4
5. Post!

IMAGE LAYOUT:
-------------
Upload order maps to X's 2×2 grid:

┌─────┬─────┐
│  1  │  2  │
├─────┼─────┤
│  3  │  4  │
└─────┴─────┘

${isPortrait ? `
PORTRAIT MODE - HOW IT WORKS:
-----------------------------
• Timeline: Shows a creative 2×2 grid arrangement
• When Opened: Swiping through 1→2→3→4 reveals the full portrait!

The 4 images are horizontal strips:
  1 = Top of your image
  2 = Upper-middle
  3 = Lower-middle  
  4 = Bottom

When someone swipes through them on X, they stack to form
your complete portrait photo. It's like a vertical puzzle!

PRO TIP: Add a caption like "Swipe to see the full picture 👀"
` : `
LANDSCAPE MODE - HOW IT WORKS:
------------------------------
• Timeline: The 4 quadrants form a SEAMLESS panorama
• When Opened: Each image shows extended content

The 4 images are quadrants:
  1 = Top-Left      2 = Top-Right
  3 = Bottom-Left   4 = Bottom-Right

In the timeline, they tile together perfectly.
When tapped, each image reveals more content above/below.

PRO TIP: Works best with wide landscape photos or panoramas!
`}
TROUBLESHOOTING:
----------------
• Images not in order? Re-select them, ensuring 1.jpg is first
• Grid looks wrong? Check that X hasn't auto-cropped unexpectedly
• Effect not working? Make sure you uploaded exactly 4 images

Created with X Image Slicer
https://github.com/your-username/x-image-slicer
`;

  zip.file('README.txt', readme);

  // Generate and download ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${filename}.zip`);
};

/**
 * Downloads individual images without ZIP
 * @param {Blob[]} imageBlobs - Array of image blobs
 * @param {string} prefix - Filename prefix
 */
export const downloadIndividual = (imageBlobs, prefix = 'x-grid') => {
  const names = ['1', '2', '3', '4'];
  
  imageBlobs.forEach((blob, index) => {
    saveAs(blob, `${prefix}-${names[index]}.jpg`);
  });
};
