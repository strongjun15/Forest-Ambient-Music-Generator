import generateMultimodalPrompt, { calculateEdgeDensity } from './HSV_EdgeDensity_algorithm.js';

interface HSVResult {
  h: number;
  s: number;
  v: number;
}

export interface AnalysisResult {
  prompt: string;
  hsv: HSVResult;
  edgeDensity: number;
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

function toGrayscale(imageData: ImageData): Uint8Array {
  const { data, width, height } = imageData;
  const gray = new Uint8Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    const offset = i * 4;
    gray[i] = Math.round(0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2]);
  }
  return gray;
}

function gaussianBlur(gray: Uint8Array, width: number, height: number): Uint8Array {
  const kernel = [1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, 36, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1];
  const kernelSize = 5;
  const half = Math.floor(kernelSize / 2);
  const kernelSum = 256;
  const result = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const px = Math.min(Math.max(x + kx, 0), width - 1);
          const py = Math.min(Math.max(y + ky, 0), height - 1);
          sum += gray[py * width + px] * kernel[(ky + half) * kernelSize + (kx + half)];
        }
      }
      result[y * width + x] = Math.round(sum / kernelSum);
    }
  }
  return result;
}

function sobelEdgeDetection(gray: Uint8Array, width: number, height: number): Uint8Array {
  const edges = new Uint8Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;

      const tl = gray[(y - 1) * width + (x - 1)];
      const tc = gray[(y - 1) * width + x];
      const tr = gray[(y - 1) * width + (x + 1)];
      const ml = gray[y * width + (x - 1)];
      const mr = gray[y * width + (x + 1)];
      const bl = gray[(y + 1) * width + (x - 1)];
      const bc = gray[(y + 1) * width + x];
      const br = gray[(y + 1) * width + (x + 1)];

      const gx = -tl + tr - 2 * ml + 2 * mr - bl + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[idx] = Math.min(255, Math.round(magnitude));
    }
  }

  return edges;
}

function applyCannyThreshold(edges: Uint8Array, lowThreshold: number, highThreshold: number): Uint8Array {
  const result = new Uint8Array(edges.length);
  for (let i = 0; i < edges.length; i++) {
    if (edges[i] >= highThreshold) {
      result[i] = 255;
    } else if (edges[i] >= lowThreshold) {
      result[i] = 128;
    } else {
      result[i] = 0;
    }
  }
  return result;
}

function computeEdgeDensityFromImage(imageData: ImageData): number {
  const { width, height } = imageData;
  const gray = toGrayscale(imageData);
  const blurred = gaussianBlur(gray, width, height);
  const edges = sobelEdgeDetection(blurred, width, height);
  const cannyEdges = applyCannyThreshold(edges, 30, 80);
  return calculateEdgeDensity(cannyEdges);
}

export function analyzeImage(imageElement: HTMLImageElement): AnalysisResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const maxSize = 200;
  const scale = Math.min(maxSize / imageElement.naturalWidth, maxSize / imageElement.naturalHeight, 1);
  canvas.width = Math.round(imageElement.naturalWidth * scale);
  canvas.height = Math.round(imageElement.naturalHeight * scale);

  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const hsv = getAverageHSV(imageData);
  const edgeDensity = computeEdgeDensityFromImage(imageData);
  const prompt = generateMultimodalPrompt(hsv.h, hsv.s, hsv.v, edgeDensity, false);

  return { prompt, hsv, edgeDensity };
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
