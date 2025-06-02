'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { ProfileData, getProfileName } from '@/types/profile';

type MessageDialogProps = {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
};

export function MessageDialog({ profile, isOpen, onClose, currentUserId }: MessageDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Focus the textarea when the dialog opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) {
      showToast.error('Please enter a message');
      return;
    }
    
    if (!currentUserId) {
      showToast.error('You must be logged in to send messages');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: profile.id,
          content: message.trim()
        });
      
      if (error) throw error;
      
      showToast.success(`Message sent to ${getProfileName(profile)}!`);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      showToast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Message {getProfileName(profile)}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              id="message"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`What would you like to say to ${getProfileName(profile)}?`}
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:ring-[#D28000] focus:border-[#D28000] outline-none resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-right text-gray-500 mt-1">
              {message.length}/1000 characters
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-gray-300"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="bg-[#D28000] hover:bg-[#b06c00] text-white"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
