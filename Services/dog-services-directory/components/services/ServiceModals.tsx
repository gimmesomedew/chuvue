'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ServiceModalsProps {
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  serviceName: string;
}

export function ServiceModals({
  isDeleteDialogOpen,
  isDeleting,
  onDeleteConfirm,
  onDeleteCancel,
  serviceName,
}: ServiceModalsProps) {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{serviceName}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 