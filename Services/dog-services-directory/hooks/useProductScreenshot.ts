import { useState } from 'react';
import { toast } from '@/lib/toast';

interface UseProductScreenshotReturn {
  isCapturing: boolean;
  captureScreenshot: (productId: number, websiteUrl: string) => Promise<string | null>;
  refreshScreenshot: (productId: number, websiteUrl: string) => Promise<string | null>;
}

export function useProductScreenshot(): UseProductScreenshotReturn {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreenshot = async (productId: number, websiteUrl: string): Promise<string | null> => {
    if (!websiteUrl) {
      toast({
        title: "No website URL",
        description: "This product doesn't have a website to capture a screenshot from.",
        variant: "destructive"
      });
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

      toast({
        title: "Screenshot captured!",
        description: "The website screenshot has been saved successfully.",
        variant: "default"
      });

      console.log('✅ Screenshot captured successfully:', data.screenshot_url);
      return data.screenshot_url;

    } catch (error) {
      console.error('❌ Screenshot capture failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Screenshot failed",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const refreshScreenshot = async (productId: number, websiteUrl: string): Promise<string | null> => {
    toast({
      title: "Refreshing screenshot",
      description: "Capturing a new screenshot of the website...",
      variant: "default"
    });

    return captureScreenshot(productId, websiteUrl);
  };

  return {
    isCapturing,
    captureScreenshot,
    refreshScreenshot
  };
}
