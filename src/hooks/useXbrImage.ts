import { useState, useEffect } from 'react';
import { processImageWithXbr } from '../utils/xbrScaler';
import type { EmulatorShader } from '../constants/spriteStyles';

/**
 * Hook to dynamically upscale sprites with Hyllian's xBR / xBRZ algorithm.
 */
export function useXbrImage(
  src: string,
  shader: EmulatorShader = 'none'
): { imageSrc: string; isProcessing: boolean } {
  const [processedSrc, setProcessedSrc] = useState<string>(src);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setProcessedSrc(src);
      return;
    }

    // Only apply canvas xBR if shader is an xBR mode
    if (shader === 'xbr-2x' || shader === 'xbr-3x' || shader === 'xbr-hd' || shader === 'xbr-comic') {
      let isMounted = true;
      setIsProcessing(true);

      const xbrMode = shader === 'xbr-2x' ? 'xbr-2x' : 'xbr-3x';

      processImageWithXbr(src, xbrMode)
        .then((scaledUrl) => {
          if (isMounted) {
            setProcessedSrc(scaledUrl);
            setIsProcessing(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setProcessedSrc(src);
            setIsProcessing(false);
          }
        });

      return () => {
        isMounted = false;
      };
    } else {
      // Default direct source for 'none', 'ink', 'sketch' etc.
      setProcessedSrc(src);
      setIsProcessing(false);
    }
  }, [src, shader]);

  return { imageSrc: processedSrc, isProcessing };
}
