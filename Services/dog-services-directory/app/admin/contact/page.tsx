"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Eye, Archive, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { hasRole } from '@/lib/supabase';
import { ContactFormData, getContactSubmissions, updateContactStatus } from '@/lib/contact';

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'new' | 'read' | 'replied' | 'archived' | undefined>(undefined);
  const router = useRouter();

  // Check if user has admin role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAdmin = await hasRole('admin');
        setIsAuthorized(isAdmin);
        
        if (!isAdmin) {
          toast.error('Access Denied: You do not have permission to view this page.');
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
        router.push('/');
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch contact submissions
  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const result = await getContactSubmissions(filter, currentPage, 10);
      setSubmissions(result.submissions);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Failed to load contact submissions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load submissions when component mounts or filter/page changes
  useEffect(() => {
    if (isAuthorized) {
      fetchSubmissions();
    }
  }, [isAuthorized, filter, currentPage]);

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    try {
      const result = await updateContactStatus(id, newStatus);
      
      if (result.success) {
        toast.success(result.message || 'Status updated successfully');
        
        // Update the local state to reflect the change
        setSubmissions(prev => 
          prev.map(submission => 
            submission.id === id ? { ...submission, status: newStatus } : submission
          )
        );
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update submission status.');
    }
  };

  // Get badge color based on status
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>;
      case 'read':
        return <Badge variant="outline">Read</Badge>;
      case 'replied':
        return <Badge variant="secondary">Replied</Badge>;
      case 'archived':
        return <Badge variant="default">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Form Submissions</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter(undefined)}
            className={!filter ? 'bg-primary/10' : ''}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter('new')}
            className={filter === 'new' ? 'bg-primary/10' : ''}
          >
            New
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter('read')}
            className={filter === 'read' ? 'bg-primary/10' : ''}
          >
            Read
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter('replied')}
            className={filter === 'replied' ? 'bg-primary/10' : ''}
          >
            Replied
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter('archived')}
            className={filter === 'archived' ? 'bg-primary/10' : ''}
          >
            Archived
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchSubmissions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading submissions...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">No submissions found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            {filter ? `No ${filter} contact form submissions available.` : 'No contact form submissions have been received yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{submission.subject || 'No Subject'}</CardTitle>
                    <CardDescription className="mt-1">
                      From: {submission.name} ({submission.email})
                    </CardDescription>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {submission.created_at && (
                    format(new Date(submission.created_at), 'MMM d, yyyy h:mm a')
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="max-h-32 overflow-y-auto text-sm">
                  {submission.message}
                </div>
                
                {submission.phone && (
                  <div className="mt-3 text-xs text-gray-500">
                    Phone: {submission.phone}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleStatusChange(submission.id!, 'read')}
                  disabled={submission.status === 'read'}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Mark as Read
                </Button>
                
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusChange(submission.id!, 'replied')}
                    disabled={submission.status === 'replied'}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Replied
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusChange(submission.id!, 'archived')}
                    disabled={submission.status === 'archived'}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            
            <div className="flex items-center px-4 text-sm">
              Page {currentPage} of {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
