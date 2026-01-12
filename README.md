# X Image Slicer 🎨

A free, privacy-first web tool to create viral grid posts for X (Twitter). Split any image into 4 pieces that form stunning reveal effects or seamless panoramas when posted on X.

![X Image Slicer](https://img.shields.io/badge/X-Image%20Slicer-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

- **🎯 Two Modes:**
  - **Portrait Mode**: Creates 4 horizontal strips that stack when swiped to reveal a full portrait
  - **Landscape Mode**: Creates 4 quadrants that form a seamless panorama in the timeline

- **🔒 Privacy First:**
  - 100% client-side processing
  - No server uploads
  - Your images never leave your device

- **⚡ Fast & Easy:**
  - Upload, crop, download in seconds
  - Automatic image optimization
  - Ready-to-post ZIP file with numbered images

- **🎨 Beautiful UI:**
  - X-inspired dark theme
  - Intuitive step-by-step process
  - Live preview of how your post will look

## 🚀 Quick Start

### Online (Recommended)
Visit the live site: https://github.com/theVinesh/x-image-slicer

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/theVinesh/x-image-slicer.git
   cd x-image-slicer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📖 How to Use

### Step 1: Upload
- Click to upload an image or drag and drop
- Choose between **Portrait** or **Landscape** mode

### Step 2: Crop
- Adjust the crop area to focus on the part you want to showcase
- The tool automatically handles the slicing

### Step 3: Download
- Preview how your post will appear on X
- Download a ZIP file containing 4 numbered images (1.jpg, 2.jpg, 3.jpg, 4.jpg)

### Step 4: Post on X
1. Extract the ZIP file
2. Create a new post on X
3. Click the image icon and select all 4 images
4. **Important**: Verify they appear in order: 1, 2, 3, 4
5. Post and watch the magic! ✨

## 🎯 Use Cases

- **Portrait Reveals**: Create engaging portrait posts that reveal the full image when swiped
- **Panoramic Views**: Showcase wide landscapes or panoramas in a seamless grid
- **Creative Content**: Stand out on X with unique visual effects
- **Brand Marketing**: Create eye-catching social media content

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **react-easy-crop** - Image cropping
- **JSZip** - ZIP file generation
- **File Saver** - Download functionality

## 📁 Project Structure

```
x-image-slicer/
├── src/
│   ├── components/
│   │   ├── DownloadButton.jsx    # Download and share functionality
│   │   ├── ImageCropper.jsx      # Image cropping interface
│   │   ├── ImageUploader.jsx     # File upload component
│   │   └── PreviewGrid.jsx       # Preview of X post appearance
│   ├── utils/
│   │   ├── imageSlicing.js       # Core image processing logic
│   │   └── zipGenerator.js       # ZIP file creation
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Entry point
├── public/
│   └── favicon.svg
├── index.html
└── package.json
```

## 🔧 Configuration

### Build Output
The app builds to `./dist` directory by default (configured in `vite.config.js`).

### Cloudflare Deployment
The project includes `wrangler.jsonc` for easy deployment to Cloudflare Pages:

```jsonc
{
  "name": "x-image-slicer",
  "compatibility_date": "2026-01-12",
  "assets": {
    "directory": "./dist"
  }
}
```

Deploy with:
```bash
npm run build
npx wrangler deploy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by viral X/Twitter grid posts
- Built with privacy and user experience in mind
- Powered by modern web technologies

## 📧 Contact

Created by [Vinesh](https://thevinesh.com) and his AIs

---

⭐ If you find this tool useful, please star the repository!
