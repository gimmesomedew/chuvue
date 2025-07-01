import { showToast } from '@/lib/toast';

// Re-export the showToast utility
export const toast = showToast;

// For backward compatibility
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Legacy hook for backward compatibility
export const useToast = () => {
  return {
    toast: (options: ToastOptions) => {
      const { title, description, variant = 'default', duration = 5000 } = options;
      const message = title ? (description ? `${title}: ${description}` : title) : description;
      
      if (!message) return undefined;
      
      if (variant === 'destructive') {
        return showToast.error(message, { duration });
      }
      
      return showToast.success(message, { duration });
    },
    dismiss: showToast.dismiss
  };
};
