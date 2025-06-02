// Direct export of react-hot-toast
import toast from 'react-hot-toast';

// Re-export toast directly
export { toast };

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
        return toast.error(message, { duration });
      }
      
      return toast.success(message, { duration });
    },
    dismiss: toast.dismiss
  };
};
