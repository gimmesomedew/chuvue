import toast, { Toast } from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'loading';

interface ToastOptions {
  duration?: number;
  id?: string;
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, options);
  },
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, options);
  },
  dismiss: (toastId?: Toast['id']) => {
    toast.dismiss(toastId);
  },
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading,
        success,
        error,
      },
      options
    );
  },
};
