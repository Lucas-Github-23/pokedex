import React from 'react';

/**
 * SVG Definition filters for transforming pixels and 3D sprites into
 * hand-drawn anime lines, manga sketches, comic book cel inking, and crosshatching.
 */
export const DrawingShaderFilters: React.FC = () => {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* 1. TRAÇADO ANIME / NANQUIM (Inked Anime Lineart) */}
        <filter id="shader-filter-ink" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* Boost contrast and saturation for cel colors */}
          <feColorMatrix
            type="matrix"
            in="SourceGraphic"
            result="celColor"
            values="1.25 0 0 0 -0.06
                    0 1.25 0 0 -0.06
                    0 0 1.25 0 -0.06
                    0 0 0 1 0"
          />
          {/* Extract luminance for edge tracing */}
          <feColorMatrix
            type="matrix"
            in="SourceGraphic"
            result="luma"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
          {/* Laplacian edge detection to extract contour line strokes from pixel boundaries */}
          <feConvolveMatrix
            order="3"
            kernelMatrix="0 -1.2 0  -1.2 4.8 -1.2  0 -1.2 0"
            preserveAlpha={true}
            in="luma"
            result="edges"
          />
          {/* Convert edges into solid dark ink drawing lines */}
          <feColorMatrix
            type="matrix"
            in="edges"
            result="inkLines"
            values="-12 0 0 0 1
                    -12 0 0 0 1
                    -12 0 0 0 1
                    16 16 16 0 0"
          />
          {/* Thicken line strokes */}
          <feMorphology operator="dilate" radius="0.8" in="inkLines" result="thickLines" />
          {/* Multiply drawing ink lines over cel color */}
          <feBlend mode="multiply" in="thickLines" in2="celColor" result="inkedSprite" />
          {/* Mask back onto original alpha */}
          <feComposite operator="in" in="inkedSprite" in2="SourceGraphic" />
        </filter>

        {/* 2. TRAÇADO HQ / QUADRINHOS (Comic Book / Cel Inking) */}
        <filter id="shader-filter-comic" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* Posterize color levels for comic look */}
          <feComponentTransfer in="SourceGraphic" result="posterized">
            <feFuncR type="discrete" tableValues="0 0.2 0.45 0.7 0.9 1" />
            <feFuncG type="discrete" tableValues="0 0.2 0.45 0.7 0.9 1" />
            <feFuncB type="discrete" tableValues="0 0.2 0.45 0.7 0.9 1" />
          </feComponentTransfer>
          {/* Extract bold edge lines */}
          <feConvolveMatrix
            order="3"
            kernelMatrix="-1 -1 -1  -1 8 -1  -1 -1 -1"
            preserveAlpha={true}
            in="posterized"
            result="comicEdges"
          />
          <feColorMatrix
            type="matrix"
            in="comicEdges"
            result="boldLines"
            values="-15 0 0 0 1
                    -15 0 0 0 1
                    -15 0 0 0 1
                    14 14 14 0 0"
          />
          <feMorphology operator="dilate" radius="1.2" in="boldLines" result="heavyLines" />
          <feBlend mode="multiply" in="heavyLines" in2="posterized" result="comicResult" />
          <feComposite operator="in" in="comicResult" in2="SourceGraphic" />
        </filter>

        {/* 3. ESBOÇO MANGÁ / GRAFITE (Manga Pencil Sketch & Lineart) */}
        <filter id="shader-filter-sketch" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          {/* Desaturate to graphite tones */}
          <feColorMatrix
            type="matrix"
            in="SourceGraphic"
            result="graphite"
            values="0.33 0.33 0.33 0 0.05
                    0.33 0.33 0.33 0 0.05
                    0.33 0.33 0.33 0 0.05
                    0 0 0 1 0"
          />
          {/* Detect sketch pencil contours */}
          <feConvolveMatrix
            order="3"
            kernelMatrix="-1 -1 -1  -1 8 -1  -1 -1 -1"
            preserveAlpha={true}
            in="graphite"
            result="sketchLines"
          />
          <feColorMatrix
            type="matrix"
            in="sketchLines"
            result="darkPencil"
            values="-10 0 0 0 0.95
                    -10 0 0 0 0.95
                    -10 0 0 0 0.95
                    12 12 12 0 0"
          />
          <feBlend mode="multiply" in="darkPencil" in2="graphite" result="sketchResult" />
          <feComposite operator="in" in="sketchResult" in2="SourceGraphic" />
        </filter>

        {/* 4. CONTORNO VETORIAL / TOON (Clean Cartoon Vector Outline) */}
        <filter id="shader-filter-toon" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feMorphology operator="dilate" radius="1.6" in="SourceAlpha" result="expanded" />
          <feFlood floodColor="#0a0a0a" result="blackOutline" />
          <feComposite operator="in" in="blackOutline" in2="expanded" result="thickBlackBorder" />
          <feColorMatrix
            type="matrix"
            in="SourceGraphic"
            result="vibrant"
            values="1.2 0 0 0 0
                    0 1.2 0 0 0
                    0 0 1.2 0 0
                    0 0 0 1 0"
          />
          <feComposite operator="over" in="vibrant" in2="thickBlackBorder" />
        </filter>

        {/* 5. TRAÇADO HACHURADO / GRAVURA (Cross-hatching lines) */}
        <filter id="shader-filter-crosshatch" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            in="SourceGraphic"
            result="luma"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0 0 0 1 0"
          />
          <feConvolveMatrix
            order="3"
            kernelMatrix="1 0 -1  2 0 -2  1 0 -1"
            preserveAlpha={true}
            in="luma"
            result="hatchV"
          />
          <feConvolveMatrix
            order="3"
            kernelMatrix="1 2 1  0 0 0  -1 -2 -1"
            preserveAlpha={true}
            in="luma"
            result="hatchH"
          />
          <feBlend mode="screen" in="hatchV" in2="hatchH" result="combinedHatch" />
          <feColorMatrix
            type="matrix"
            in="combinedHatch"
            result="darkHatchLines"
            values="-12 0 0 0 1
                    -12 0 0 0 1
                    -12 0 0 0 1
                    14 14 14 0 0"
          />
          <feBlend mode="multiply" in="darkHatchLines" in2="SourceGraphic" result="hatchResult" />
          <feComposite operator="in" in="hatchResult" in2="SourceGraphic" />
        </filter>
      </defs>
    </svg>
  );
};
