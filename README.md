# 🌲 Forest Ambient Music Generator

> **Transforming visual forest patterns into generative ambient soundscapes.**

## ✨ Key Features

- **Image-to-Audio Generation**: Uses **Meta's MusicGen** to create unique, forest-themed ambient tracks based on user uploads.
- **Deterministic Image Mapping**: Instead of subjective AI descriptions, it uses computer vision to map visual data directly to musical parameters.
- **Multilingual Support**: Seamlessly supports multiple languages for a global user experience.

---

## ⚙️ How It Works

This project translates the "DNA" of an image into music through a mathematical mapping system.

### 1. HSV Color Model Analysis
We extract atmospheric data using the **HSV (Hue, Saturation, Value)** color space:
- **Hue**: Determines the core mood and emotional tone.
- **Saturation**: Maps to the timbre and texture of the instruments.
- **Value**: Influences the spatial depth and dynamics of the sound.

### 2. Structural Density via OpenCV
Using **OpenCV's Canny Filter**, we calculate the **Edge Density** of the image:
- **Edge Density (%)**: Controls the complexity of the instrumentation and the BPM. A dense forest image results in a more layered and intricate composition.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Animation**: Framer Motion
- **AI Model**: Meta MusicGen
- **Image Processing**: OpenCV

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📜 License

Copyright © 2026 **[Your Name]**.  
This project is [MIT](https://opensource.org/licenses/MIT) licensed.

**Built with ✨ Bolt.new**
