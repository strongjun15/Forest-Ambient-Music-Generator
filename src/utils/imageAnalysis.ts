import generateMusicGenPrompt from './HSV_algorithm.js';

interface HSVResult {
  h: number;
  s: number;
  v: number;
}

function rgbToHsv(r: number, g: number, b: number): HSVResult {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / diff) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / diff + 2);
    } else {
      h = 60 * ((r - g) / diff + 4);
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
}

function getAverageHSV(imageData: ImageData): HSVResult {
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;

  for (let i = 0; i < data.length; i += 4) {
    totalR += data[i];
    totalG += data[i + 1];
    totalB += data[i + 2];
  }

  const avgR = totalR / totalPixels;
  const avgG = totalG / totalPixels;
  const avgB = totalB / totalPixels;

  return rgbToHsv(avgR, avgG, avgB);
}

export function analyzeImage(imageElement: HTMLImageElement): { prompt: string; hsv: HSVResult } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const maxSize = 200;
  const scale = Math.min(maxSize / imageElement.naturalWidth, maxSize / imageElement.naturalHeight, 1);
  canvas.width = Math.round(imageElement.naturalWidth * scale);
  canvas.height = Math.round(imageElement.naturalHeight * scale);

  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const hsv = getAverageHSV(imageData);
  const prompt = generateMusicGenPrompt(hsv.h, hsv.s, hsv.v, false);

  return { prompt, hsv };
}

export function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
