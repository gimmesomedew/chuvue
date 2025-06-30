'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/lib/toast';
import { supabase } from '@/lib/supabase';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  currentUserId?: string;
}

export function MessageDialog({ isOpen, onClose, recipientId, recipientName, currentUserId }: MessageDialogProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      showToast.error('Please enter a message');
      return;
    }

    if (!currentUserId) {
      showToast.error('You must be logged in to send messages');
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: currentUserId,
        recipient_id: recipientId,
        content: message.trim()
      });

      if (error) throw error;

      showToast.success('Message sent successfully!');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      showToast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onClick={handleDialogClick}>
        <DialogHeader>
          <DialogTitle>Send Message to {recipientName}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[120px] resize-none"
            onClick={handleDialogClick}
          />
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleSend();
            }}
            disabled={isSending}
            className="bg-[#D28000] hover:bg-[#b06c00] text-white"
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
