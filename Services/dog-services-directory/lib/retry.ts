import { API_CONSTANTS } from './constants';

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: unknown) => boolean;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: unknown;
  attempts: number;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: API_CONSTANTS.RETRY_ATTEMPTS,
  delay: API_CONSTANTS.RETRY_DELAY,
  backoffMultiplier: 2,
  shouldRetry: () => true,
};

export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const config = { ...defaultOptions, ...options };
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await operation();
      return {
        success: true,
        data: result,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!config.shouldRetry(error)) {
        return {
          success: false,
          error,
          attempts: attempt,
        };
      }
      
      // If this is the last attempt, don't wait
      if (attempt === config.maxAttempts) {
        break;
      }
      
      // Wait before retrying with exponential backoff
      const waitTime = config.delay * Math.pow(config.backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  return {
    success: false,
    error: lastError,
    attempts: config.maxAttempts,
  };
}

// Specific retry functions for common use cases
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  return retry(apiCall, {
    shouldRetry: (error) => {
      // Retry on network errors, 5xx server errors, and rate limiting
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return message.includes('network') || 
               message.includes('fetch') || 
               message.includes('timeout') ||
               message.includes('429') ||
               message.includes('500') ||
               message.includes('502') ||
               message.includes('503') ||
               message.includes('504');
      }
      return false;
    },
    ...options,
  });
}

export async function retryWithTimeout<T>(
  operation: () => Promise<T>,
  timeout: number = API_CONSTANTS.TIMEOUT,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), timeout);
  });
  
  return retry(
    () => Promise.race([operation(), timeoutPromise]),
    options
  );
} 