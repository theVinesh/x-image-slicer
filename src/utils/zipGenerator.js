import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Creates a ZIP file containing the 4 sliced images and triggers download
 * Images are named in upload order for X: 1.jpg, 2.jpg, 3.jpg, 4.jpg
 * Corresponds to: Top-Left, Top-Right, Bottom-Left, Bottom-Right
 * 
 * @param {Blob[]} imageBlobs - Array of 4 image blobs
 * @param {string} filename - Name for the ZIP file (without extension)
 */
export const downloadAsZip = async (imageBlobs, filename = 'x-grid-images') => {
  const zip = new JSZip();
  
  // Add images to ZIP with numbered names
  // The order matches X's upload order: 1=TL, 2=TR, 3=BL, 4=BR
  const imageNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
  
  imageBlobs.forEach((blob, index) => {
    zip.file(imageNames[index], blob);
  });

  // Add a readme for user guidance
  const readme = `X Image Slicer - Upload Instructions
=====================================

Upload these images to X (Twitter) in EXACT ORDER:
1. Click "Add Photos" on X
2. Select ALL 4 images at once (1.jpg through 4.jpg)
3. Make sure they appear in order: 1, 2, 3, 4
4. Post!

Image Layout on X:
┌─────┬─────┐
│  1  │  2  │
├─────┼─────┤
│  3  │  4  │
└─────┴─────┘

The images will form a seamless panorama in your timeline.
When opened, each image reveals extended content.

Created with X Image Slicer
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
