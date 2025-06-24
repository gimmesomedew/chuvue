import { showToast } from '@/lib/toast';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class SearchError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'SearchError';
  }
}

export function handleSearchError(error: unknown, context: string = 'search'): void {
  console.error(`Error in ${context}:`, error);
  
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  if (error instanceof SearchError) {
    errorMessage = error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  showToast.error(errorMessage);
}

export function handleNetworkError(error: unknown): void {
  console.error('Network error:', error);
  
  showToast.error('Unable to connect to the server. Please check your internet connection and try again.');
}

export function handleValidationError(field: string, message: string): void {
  showToast.error(`${field}: ${message}`);
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') || 
           error.message.includes('connection');
  }
  return false;
} 