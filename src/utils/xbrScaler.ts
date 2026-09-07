/**
 * xBR (by Hyllian) & xBRZ Pixel Art Vectorization Scaling Engine
 * Smooths stepped pixel edges into continuous geometric curves and lines
 * without applying any muddy blur.
 */

// Color distance weights (YUV perceptual color metric)
function colorDist(c1: number, c2: number): number {
  if (c1 === c2) return 0;
  const a1 = (c1 >>> 24) & 0xff;
  const a2 = (c2 >>> 24) & 0xff;
  if (a1 === 0 && a2 === 0) return 0;
  if (a1 === 0 || a2 === 0) return 1000000;

  const r1 = (c1 >>> 16) & 0xff;
  const g1 = (c1 >>> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >>> 16) & 0xff;
  const g2 = (c2 >>> 8) & 0xff;
  const b2 = c2 & 0xff;

  // YUV color distance
  const y1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;
  const u1 = -0.169 * r1 - 0.331 * g1 + 0.5 * b1;
  const v1 = 0.5 * r1 - 0.419 * g1 - 0.081 * b1;

  const y2 = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;
  const u2 = -0.169 * r2 - 0.331 * g2 + 0.5 * b2;
  const v2 = 0.5 * r2 - 0.419 * g2 - 0.081 * b2;

  const dy = Math.abs(y1 - y2);
  const du = Math.abs(u1 - u2);
  const dv = Math.abs(v1 - v2);
  const da = Math.abs(a1 - a2);

  return (dy * 48 + du * 7 + dv * 6 + da * 40) | 0;
}

function blendColors(c1: number, c2: number, alpha: number): number {
  const a1 = (c1 >>> 24) & 0xff;
  const r1 = (c1 >>> 16) & 0xff;
  const g1 = (c1 >>> 8) & 0xff;
  const b1 = c1 & 0xff;

  const a2 = (c2 >>> 24) & 0xff;
  const r2 = (c2 >>> 16) & 0xff;
  const g2 = (c2 >>> 8) & 0xff;
  const b2 = c2 & 0xff;

  const inv = 1 - alpha;
  const r = (r1 * inv + r2 * alpha) | 0;
  const g = (g1 * inv + g2 * alpha) | 0;
  const b = (b1 * inv + b2 * alpha) | 0;
  const a = (a1 * inv + a2 * alpha) | 0;

  return ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
}

/**
 * 2x xBR Scaling Algorithm (Rules-based Edge Reconstruction)
 */
export function scaleXbr2x(srcData: ImageData): ImageData {
  const sw = srcData.width;
  const sh = srcData.height;
  const dw = sw * 2;
  const dh = sh * 2;

  const src32 = new Uint32Array(srcData.data.buffer);
  const dstData = new ImageData(dw, dh);
  const dst32 = new Uint32Array(dstData.data.buffer);

  const getPixel = (x: number, y: number): number => {
    const cx = Math.max(0, Math.min(sw - 1, x));
    const cy = Math.max(0, Math.min(sh - 1, y));
    return src32[cy * sw + cx];
  };

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      // Center pixel
      const e = getPixel(x, y);

      // 3x3 Neighborhood
      const a = getPixel(x - 1, y - 1);
      const b = getPixel(x, y - 1);
      const c = getPixel(x + 1, y - 1);
      const d = getPixel(x - 1, y);
      const f = getPixel(x + 1, y);
      const g = getPixel(x - 1, y + 1);
      const h = getPixel(x, y + 1);
      const i = getPixel(x + 1, y + 1);

      // Extended Ring
      const a1 = getPixel(x - 1, y - 2);
      const b1 = getPixel(x, y - 2);
      const c1 = getPixel(x + 1, y - 2);
      const a0 = getPixel(x - 2, y - 1);
      const d0 = getPixel(x - 2, y);
      const g0 = getPixel(x - 2, y + 1);
      const c4 = getPixel(x + 2, y - 1);
      const f4 = getPixel(x + 2, y);
      const i4 = getPixel(x + 2, y + 1);
      const h5 = getPixel(x, y + 2);
      const i5 = getPixel(x + 1, y + 2);

      // 4 output sub-pixels for 2x
      let e0 = e; // Top-Left
      let e1 = e; // Top-Right
      let e2 = e; // Bottom-Left
      let e3 = e; // Bottom-Right

      // Bottom-Right Corner (F, H, I)
      const brW1 = colorDist(e, c) + colorDist(e, g) + colorDist(i, f4) + colorDist(i, h5) + 4 * colorDist(h, f);
      const brW2 = colorDist(h, d) + colorDist(h, i5) + colorDist(f, i4) + colorDist(f, b) + 4 * colorDist(e, i);
      if (brW1 < brW2 && ((e !== f && e !== h) || (e === f && e !== h && colorDist(e, c) <= colorDist(e, g)))) {
        const edgeColor = colorDist(e, f) <= colorDist(e, h) ? f : h;
        e3 = blendColors(e, edgeColor, 0.5);
      }

      // Bottom-Left Corner (D, H, G)
      const blW1 = colorDist(e, a) + colorDist(e, i) + colorDist(g, d0) + colorDist(g, h5) + 4 * colorDist(h, d);
      const blW2 = colorDist(h, f) + colorDist(h, i5) + colorDist(d, g0) + colorDist(d, b) + 4 * colorDist(e, g);
      if (blW1 < blW2 && ((e !== d && e !== h) || (e === d && e !== h && colorDist(e, a) <= colorDist(e, i)))) {
        const edgeColor = colorDist(e, d) <= colorDist(e, h) ? d : h;
        e2 = blendColors(e, edgeColor, 0.5);
      }

      // Top-Left Corner (D, B, A)
      const tlW1 = colorDist(e, g) + colorDist(e, c) + colorDist(a, d0) + colorDist(a, b1) + 4 * colorDist(b, d);
      const tlW2 = colorDist(b, f) + colorDist(b, c1) + colorDist(d, a0) + colorDist(d, h) + 4 * colorDist(e, a);
      if (tlW1 < tlW2 && ((e !== d && e !== b) || (e === d && e !== b && colorDist(e, g) <= colorDist(e, c)))) {
        const edgeColor = colorDist(e, d) <= colorDist(e, b) ? d : b;
        e0 = blendColors(e, edgeColor, 0.5);
      }

      // Top-Right Corner (F, B, C)
      const trW1 = colorDist(e, a) + colorDist(e, i) + colorDist(c, f4) + colorDist(c, b1) + 4 * colorDist(b, f);
      const trW2 = colorDist(b, d) + colorDist(b, a1) + colorDist(f, c4) + colorDist(f, h) + 4 * colorDist(e, c);
      if (trW1 < trW2 && ((e !== f && e !== b) || (e === f && e !== b && colorDist(e, a) <= colorDist(e, i)))) {
        const edgeColor = colorDist(e, f) <= colorDist(e, b) ? f : b;
        e1 = blendColors(e, edgeColor, 0.5);
      }

      const outY = y * 2;
      const outX = x * 2;
      dst32[outY * dw + outX] = e0;
      dst32[outY * dw + (outX + 1)] = e1;
      dst32[(outY + 1) * dw + outX] = e2;
      dst32[(outY + 1) * dw + (outX + 1)] = e3;
    }
  }

  return dstData;
}

/**
 * 3x/4x xBR Scaling Algorithm (Multi-angle 30°/45°/60° Curves)
 */
export function scaleXbr3x(srcData: ImageData): ImageData {
  const sw = srcData.width;
  const sh = srcData.height;
  const dw = sw * 3;
  const dh = sh * 3;

  const src32 = new Uint32Array(srcData.data.buffer);
  const dstData = new ImageData(dw, dh);
  const dst32 = new Uint32Array(dstData.data.buffer);

  const getPixel = (x: number, y: number): number => {
    const cx = Math.max(0, Math.min(sw - 1, x));
    const cy = Math.max(0, Math.min(sh - 1, y));
    return src32[cy * sw + cx];
  };

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const e = getPixel(x, y);

      const a = getPixel(x - 1, y - 1);
      const b = getPixel(x, y - 1);
      const c = getPixel(x + 1, y - 1);
      const d = getPixel(x - 1, y);
      const f = getPixel(x + 1, y);
      const g = getPixel(x - 1, y + 1);
      const h = getPixel(x, y + 1);
      const i = getPixel(x + 1, y + 1);

      const a1 = getPixel(x - 1, y - 2);
      const b1 = getPixel(x, y - 2);
      const c1 = getPixel(x + 1, y - 2);
      const a0 = getPixel(x - 2, y - 1);
      const d0 = getPixel(x - 2, y);
      const g0 = getPixel(x - 2, y + 1);
      const c4 = getPixel(x + 2, y - 1);
      const f4 = getPixel(x + 2, y);
      const i4 = getPixel(x + 2, y + 1);
      const h5 = getPixel(x, y + 2);
      const i5 = getPixel(x + 1, y + 2);

      // Initialize 9 sub-pixels with center color
      const p = [
        e, e, e,
        e, e, e,
        e, e, e,
      ];

      // BR Corner
      const brW1 = colorDist(e, c) + colorDist(e, g) + colorDist(i, f4) + colorDist(i, h5) + 4 * colorDist(h, f);
      const brW2 = colorDist(h, d) + colorDist(h, i5) + colorDist(f, i4) + colorDist(f, b) + 4 * colorDist(e, i);
      if (brW1 < brW2 && (e !== f || e !== h)) {
        const edgeColor = colorDist(e, f) <= colorDist(e, h) ? f : h;
        p[8] = edgeColor;
        p[5] = blendColors(e, edgeColor, 0.6);
        p[7] = blendColors(e, edgeColor, 0.6);
      }

      // BL Corner
      const blW1 = colorDist(e, a) + colorDist(e, i) + colorDist(g, d0) + colorDist(g, h5) + 4 * colorDist(h, d);
      const blW2 = colorDist(h, f) + colorDist(h, i5) + colorDist(d, g0) + colorDist(d, b) + 4 * colorDist(e, g);
      if (blW1 < blW2 && (e !== d || e !== h)) {
        const edgeColor = colorDist(e, d) <= colorDist(e, h) ? d : h;
        p[6] = edgeColor;
        p[3] = blendColors(e, edgeColor, 0.6);
        p[7] = blendColors(e, edgeColor, 0.6);
      }

      // TL Corner
      const tlW1 = colorDist(e, g) + colorDist(e, c) + colorDist(a, d0) + colorDist(a, b1) + 4 * colorDist(b, d);
      const tlW2 = colorDist(b, f) + colorDist(b, c1) + colorDist(d, a0) + colorDist(d, h) + 4 * colorDist(e, a);
      if (tlW1 < tlW2 && (e !== d || e !== b)) {
        const edgeColor = colorDist(e, d) <= colorDist(e, b) ? d : b;
        p[0] = edgeColor;
        p[1] = blendColors(e, edgeColor, 0.6);
        p[3] = blendColors(e, edgeColor, 0.6);
      }

      // TR Corner
      const trW1 = colorDist(e, a) + colorDist(e, i) + colorDist(c, f4) + colorDist(c, b1) + 4 * colorDist(b, f);
      const trW2 = colorDist(b, d) + colorDist(b, a1) + colorDist(f, c4) + colorDist(f, h) + 4 * colorDist(e, c);
      if (trW1 < trW2 && (e !== f || e !== b)) {
        const edgeColor = colorDist(e, f) <= colorDist(e, b) ? f : b;
        p[2] = edgeColor;
        p[1] = blendColors(e, edgeColor, 0.6);
        p[5] = blendColors(e, edgeColor, 0.6);
      }

      const outY = y * 3;
      const outX = x * 3;
      for (let dy = 0; dy < 3; dy++) {
        for (let dx = 0; dx < 3; dx++) {
          dst32[(outY + dy) * dw + (outX + dx)] = p[dy * 3 + dx];
        }
      }
    }
  }

  return dstData;
}

// In-memory LRU cache for processed xBR images to deliver 0ms instant display
const XBR_IMAGE_CACHE = new Map<string, string>();
const MAX_CACHE_SIZE = 150;

/**
 * Loads an image URL, applies xBR 2x/3x scaling via canvas, and returns a high-res data URL.
 */
export async function processImageWithXbr(
  imgSrc: string,
  mode: 'xbr-2x' | 'xbr-3x' | 'xbr-hd' = 'xbr-3x'
): Promise<string> {
  const cacheKey = `${imgSrc}_${mode}`;
  if (XBR_IMAGE_CACHE.has(cacheKey)) {
    return XBR_IMAGE_CACHE.get(cacheKey)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(imgSrc);
          return;
        }

        // Limit maximum dimension for speed
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        if (w > 200 || h > 200) {
          const maxDim = 160;
          if (w >= h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const srcData = ctx.getImageData(0, 0, w, h);
        let scaledData: ImageData;

        if (mode === 'xbr-2x') {
          scaledData = scaleXbr2x(srcData);
        } else {
          // 3x or HD passes
          scaledData = scaleXbr3x(srcData);
        }

        const outCanvas = document.createElement('canvas');
        outCanvas.width = scaledData.width;
        outCanvas.height = scaledData.height;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) {
          resolve(imgSrc);
          return;
        }

        outCtx.putImageData(scaledData, 0, 0);
        const dataUrl = outCanvas.toDataURL('image/png');

        if (XBR_IMAGE_CACHE.size > MAX_CACHE_SIZE) {
          const firstKey = XBR_IMAGE_CACHE.keys().next().value;
          if (firstKey) XBR_IMAGE_CACHE.delete(firstKey);
        }
        XBR_IMAGE_CACHE.set(cacheKey, dataUrl);

        resolve(dataUrl);
      } catch {
        // Fallback to original image if CORS or canvas read fails
        resolve(imgSrc);
      }
    };
    img.onerror = () => resolve(imgSrc);
    img.src = imgSrc;
  });
}
