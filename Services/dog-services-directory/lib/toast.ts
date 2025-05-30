import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading';

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
  custom: (message: string, type: ToastType) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'loading':
        return toast.loading(message);
      default:
        toast(message);
    }
  },
};
