import { useState } from 'react';
import { showToast } from '@/lib/toast';

interface UseProductScreenshotReturn {
  isCapturing: boolean;
  captureScreenshot: (productId: number, websiteUrl: string) => Promise<string | null>;
  refreshScreenshot: (productId: number, websiteUrl: string) => Promise<string | null>;
}

export function useProductScreenshot(): UseProductScreenshotReturn {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreenshot = async (productId: number, websiteUrl: string): Promise<string | null> => {
    if (!websiteUrl) {
      showToast.error("This product doesn't have a website to capture a screenshot from.");
      return null;
    }

    setIsCapturing(true);
    
    try {
      console.log('📸 Capturing screenshot for product', productId, 'from', websiteUrl);
      
      const response = await fetch('/api/products/screenshot-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          websiteUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture screenshot');
      }

      showToast.success("The website screenshot has been saved successfully.");

      console.log('✅ Screenshot captured successfully:', data.screenshot_url);
      return data.screenshot_url;

    } catch (error) {
      console.error('❌ Screenshot capture failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      showToast.error(errorMessage);

      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const refreshScreenshot = async (productId: number, websiteUrl: string): Promise<string | null> => {
    showToast.loading("Capturing a new screenshot of the website...");

    return captureScreenshot(productId, websiteUrl);
  };

  return {
    isCapturing,
    captureScreenshot,
    refreshScreenshot
  };
}
