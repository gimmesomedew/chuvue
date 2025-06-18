import { supabase } from './supabase';

export interface ErrorLog {
  id?: string;
  error_message: string;
  action: string;
  context: string;
  user_id?: string;
  user_email?: string;
  created_at?: string;
  stack_trace?: string;
  additional_data?: any;
}

/**
 * Log an error to the Supabase error_logs table
 * @param error The error object or message
 * @param action The action being performed when the error occurred
 * @param context Additional context about where the error occurred
 * @param additionalData Any additional data that might be helpful for debugging
 */
export async function logError(
  error: Error | string,
  action: string,
  context: string,
  additionalData?: any
): Promise<void> {
  try {
    // Get current user if available
    const { data: { user } } = await supabase.auth.getUser();

    // Prepare error log entry
    const errorLog: ErrorLog = {
      error_message: error instanceof Error ? error.message : error,
      action,
      context,
      user_id: user?.id,
      user_email: user?.email,
      stack_trace: error instanceof Error ? error.stack : undefined,
      additional_data: additionalData,
      created_at: new Date().toISOString()
    };

    // Insert into error_logs table
    const { error: insertError } = await supabase
      .from('error_logs')
      .insert([errorLog]);

    if (insertError) {
      console.error('Failed to log error:', insertError);
    }
  } catch (loggingError) {
    console.error('Error in error logging system:', loggingError);
  }
}

// Common error logging functions for specific scenarios
export const ErrorActions = {
  LOCATION: 'Location Access',
  LOGOUT: 'User Logout',
  SEARCH: 'Service Search',
  AUTH: 'Authentication',
  FAVORITE: 'Favorite Toggle',
  PROFILE: 'Profile Update',
  SERVICE: 'Service Management'
} as const;

/**
 * Log a location-related error
 */
export async function logLocationError(error: Error | string, context: string): Promise<void> {
  await logError(error, ErrorActions.LOCATION, context);
}

/**
 * Log a logout-related error
 */
export async function logLogoutError(error: Error | string, context: string): Promise<void> {
  await logError(error, ErrorActions.LOGOUT, context);
}

/**
 * Log a search-related error
 */
export async function logSearchError(error: Error | string, context: string, searchParams?: any): Promise<void> {
  await logError(error, ErrorActions.SEARCH, context, searchParams);
}

/**
 * Log an authentication-related error
 */
export async function logAuthError(error: Error | string, context: string): Promise<void> {
  await logError(error, ErrorActions.AUTH, context);
}

/**
 * Log a favorite toggle-related error
 */
export async function logFavoriteError(error: Error | string, context: string, serviceId?: string): Promise<void> {
  await logError(error, ErrorActions.FAVORITE, context, { serviceId });
}

/**
 * Log a profile-related error
 */
export async function logProfileError(error: Error | string, context: string): Promise<void> {
  await logError(error, ErrorActions.PROFILE, context);
}

/**
 * Log a service management-related error
 */
export async function logServiceError(error: Error | string, context: string, serviceId?: string): Promise<void> {
  await logError(error, ErrorActions.SERVICE, context, { serviceId });
} 