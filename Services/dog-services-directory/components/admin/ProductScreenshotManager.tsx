'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useProductScreenshot } from '@/hooks/useProductScreenshot';
import { cn } from '@/lib/utils';

interface ProductScreenshotManagerProps {
  product: Product;
  className?: string;
}

export function ProductScreenshotManager({ 
  product, 
  className 
}: ProductScreenshotManagerProps) {
  const { isCapturing, captureScreenshot, refreshScreenshot } = useProductScreenshot();
  const [currentScreenshotUrl, setCurrentScreenshotUrl] = useState<string | null>(
    (product as any).screenshot_url || null
  );

  const handleCaptureScreenshot = async () => {
    if (!product.website) return;
    
    const screenshotUrl = await captureScreenshot(product.id, product.website);
    if (screenshotUrl) {
      setCurrentScreenshotUrl(screenshotUrl);
    }
  };

  const handleRefreshScreenshot = async () => {
    if (!product.website) return;
    
    const screenshotUrl = await refreshScreenshot(product.id, product.website);
    if (screenshotUrl) {
      setCurrentScreenshotUrl(screenshotUrl);
    }
  };

  const getScreenshotStatus = () => {
    if (currentScreenshotUrl) {
      return {
        status: 'success' as const,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        text: 'Screenshot available'
      };
    } else if (product.website) {
      return {
        status: 'pending' as const,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        text: 'No screenshot yet'
      };
    } else {
      return {
        status: 'unavailable' as const,
        icon: AlertCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        text: 'No website available'
      };
    }
  };

  const status = getScreenshotStatus();
  const StatusIcon = status.icon;

  return (
    <Card className={cn("bg-white/90 backdrop-blur-sm border border-white/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Screenshot Management
        </CardTitle>
        <div className="flex items-center gap-2">
          <StatusIcon className={cn("w-4 h-4", status.color)} />
          <span className={cn("text-sm font-medium", status.color)}>
            {status.text}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Screenshot Display */}
        {currentScreenshotUrl && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Current Screenshot</h4>
            <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
              <img
                src={currentScreenshotUrl}
                alt={`Screenshot of ${product.name} website`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.warn('Screenshot failed to load:', currentScreenshotUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.parentElement?.querySelector('.screenshot-placeholder') as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
              <div className="screenshot-placeholder w-full h-full flex items-center justify-center bg-gray-100 text-gray-500" style={{ display: 'none' }}>
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Screenshot unavailable</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Website Information */}
        {product.website && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Website</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <ExternalLink className="w-3 h-3 mr-1" />
                {product.website}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-blue-600 hover:text-blue-700"
                onClick={() => window.open(product.website, '_blank')}
              >
                Open
              </Button>
            </div>
          </div>
        )}

        {/* Screenshot Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Actions</h4>
          <div className="flex gap-2">
            {!currentScreenshotUrl && product.website && (
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCaptureScreenshot}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Screenshot
                  </>
                )}
              </Button>
            )}
            
            {currentScreenshotUrl && product.website && (
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={handleRefreshScreenshot}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Screenshot
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Status Information */}
        <div className={cn("p-3 rounded-lg border", status.bgColor, status.borderColor)}>
          <div className="flex items-center text-sm">
            <StatusIcon className={cn("w-4 h-4 mr-2", status.color)} />
            <span className={cn("font-medium", status.color)}>
              {status.status === 'success' && 'Screenshot is available and will be displayed on the product card'}
              {status.status === 'pending' && 'Click "Capture Screenshot" to generate a website preview'}
              {status.status === 'unavailable' && 'Add a website URL to enable screenshot capture'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
