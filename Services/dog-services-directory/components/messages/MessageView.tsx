'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MessageViewProps = {
  message: any;
  activeTab: 'inbox' | 'sent';
  onSendReply: (content: string, recipientId: string) => void;
};

export function MessageView({ message, activeTab, onSendReply }: MessageViewProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isReplying && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isReplying]);

  if (!message) {
    return null;
  }

  const getDisplayName = () => {
    const profile = message.profiles;
    return profile?.pet_name || profile?.email?.split('@')[0] || 'Unknown User';
  };

  const getAvatar = () => {
    const profile = message.profiles;
    return profile?.profile_photo;
  };

  const handleSendReply = () => {
    if (!replyContent.trim()) return;
    
    // Get the recipient ID (sender of the message if we're in inbox)
    const recipientId = activeTab === 'inbox' ? message.sender_id : message.recipient_id;
    
    onSendReply(replyContent, recipientId);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Message Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-3">
          {getAvatar() ? (
            <img 
              src={getAvatar()} 
              alt={getDisplayName()}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{getDisplayName()}</p>
            <p className="text-xs text-gray-500">
              {format(new Date(message.created_at), 'PPP p')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Message Content */}
      <div className="p-6">
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{message.content}</p>
        </div>
      </div>
      
      {/* Reply Section - Only show for inbox messages */}
      {activeTab === 'inbox' && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          {isReplying ? (
            <div className="space-y-3">
              <textarea
                ref={textareaRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D28000] focus:border-[#D28000] outline-none resize-none min-h-[100px]"
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {replyContent.length}/1000 characters
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendReply}
                    disabled={!replyContent.trim()}
                    className="bg-[#D28000] hover:bg-[#b06c00] text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => setIsReplying(true)}
              className="bg-[#D28000] hover:bg-[#b06c00] text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Reply
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
