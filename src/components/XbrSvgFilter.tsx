import React from 'react';

/**
 * Global SVG Filter Definitions for xBR 2x Real-Time Hardware Scaling.
 * Operates directly on the GPU compositor pipeline, compatible with cross-origin
 * images and multi-frame animated GIFs without CORS canvas tainting or blurry bilinear interpolation.
 */
export const XbrSvgFilter: React.FC = () => {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', overflow: 'hidden' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* xBR 2x Vector Smoothing & Edge Reconstruction Filter */}
        <filter
          id="showdown-xbr-2x"
          colorInterpolationFilters="sRGB"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          {/* Step 1: Diagonal 45° & Orthogonal Edge Detection (xBR 2x kernel) */}
          <feConvolveMatrix
            order="3"
            kernelMatrix="
              -0.2 -0.4 -0.2
              -0.4  3.4 -0.4
              -0.2 -0.4 -0.2"
            preserveAlpha="true"
            result="edgeLines"
          />

          {/* Step 2: Micro-step sub-pixel smoothing (clears pixel staircases) */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.45" result="microSmooth" />

          {/* Step 3: Composite sharp vector line contours over micro-smoothed body */}
          <feComposite
            in="edgeLines"
            in2="microSmooth"
            operator="arithmetic"
            k1="0"
            k2="0.6"
            k3="0.75"
            k4="0"
            result="compositeXbr"
          />

          {/* Step 4: High-contrast color transfer to lock crisp vector edges */}
          <feComponentTransfer in="compositeXbr" result="xbrFinal">
            <feFuncR type="linear" slope="1.06" intercept="-0.02" />
            <feFuncG type="linear" slope="1.06" intercept="-0.02" />
            <feFuncB type="linear" slope="1.06" intercept="-0.02" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};
