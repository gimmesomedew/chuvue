import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

// Create an admin client with the service role key for operations that need to bypass RLS
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

/**
 * Contact form submission interface
 */
export interface ContactFormData {
  id?: string;           // UUID, auto-generated
  name: string;          // Full name of the person
  email: string;         // Email address
  phone?: string;        // Optional phone number
  message: string;       // Contact message/inquiry
  subject?: string;      // Optional subject line
  created_at?: string;   // Timestamp, auto-generated
  status?: 'new' | 'read' | 'replied' | 'archived'; // Status of the contact submission
}

/**
 * Submit a new contact form to the database
 * @param formData The contact form data to submit
 * @returns Object containing success status and message or error
 */
export async function submitContactForm(formData: Omit<ContactFormData, 'id' | 'created_at' | 'status'>): 
  Promise<{ success: boolean; message: string; error?: any }> {
  try {
    // Add default status
    const dataToSubmit = {
      ...formData,
      status: 'new' as const
    };

    // Check if we have the admin client available
    if (!supabaseAdmin) {
      console.error('Admin Supabase client not available. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
      return { 
        success: false, 
        message: 'Server configuration error. Please contact the administrator.' 
      };
    }
    
    // Insert the contact form data into the database using the admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert([dataToSubmit])
      .select();

    if (error) {
      console.error('Error submitting contact form:', error);
      return { 
        success: false, 
        message: 'There was an error submitting your contact form. Please try again.', 
        error 
      };
    }

    return { 
      success: true, 
      message: 'Your message has been sent successfully! We will get back to you soon.' 
    };
  } catch (error) {
    console.error('Exception in submitContactForm:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again later.', 
      error 
    };
  }
}

/**
 * Get all contact form submissions with optional filtering and pagination
 * @param status Optional status filter
 * @param page Page number for pagination (starts at 1)
 * @param pageSize Number of items per page
 * @returns Object containing submissions array and pagination info
 */
export async function getContactSubmissions(
  status?: 'new' | 'read' | 'replied' | 'archived',
  page: number = 1,
  pageSize: number = 20
): Promise<{ 
  submissions: ContactFormData[], 
  total: number, 
  page: number, 
  totalPages: number 
}> {
  try {
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Check if we have the admin client available
    if (!supabaseAdmin) {
      console.error('Admin Supabase client not available. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
      return { submissions: [], total: 0, page, totalPages: 0 };
    }
    
    // Start building the query using the admin client to bypass RLS
    let query = supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact' });

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Execute the query with pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching contact submissions:', error);
      return { submissions: [], total: 0, page, totalPages: 0 };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      submissions: data as ContactFormData[],
      total,
      page,
      totalPages
    };
  } catch (error) {
    console.error('Exception in getContactSubmissions:', error);
    return { submissions: [], total: 0, page, totalPages: 0 };
  }
}

/**
 * Update the status of a contact submission
 * @param id The ID of the submission to update
 * @param status The new status
 * @returns Object containing success status and message or error
 */
export async function updateContactStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived'
): Promise<{ success: boolean; message: string; error?: any }> {
  try {
    // Check if we have the admin client available
    if (!supabaseAdmin) {
      console.error('Admin Supabase client not available. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
      return { 
        success: false, 
        message: 'Server configuration error. Please contact the administrator.' 
      };
    }
    
    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error(`Error updating contact submission ${id}:`, error);
      return { 
        success: false, 
        message: 'There was an error updating the submission status.', 
        error 
      };
    }

    return { 
      success: true, 
      message: 'Submission status updated successfully.' 
    };
  } catch (error) {
    console.error(`Exception in updateContactStatus for ID ${id}:`, error);
    return { 
      success: false, 
      message: 'An unexpected error occurred while updating the status.', 
      error 
    };
  }
}
