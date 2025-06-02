'use client';

import { formatDistanceToNow } from 'date-fns';
import { User, MessageCircle } from 'lucide-react';

type MessageListProps = {
  messages: any[];
  loading: boolean;
  activeTab: 'inbox' | 'sent';
  selectedMessageId: string | null;
  onSelectMessage: (messageId: string) => void;
};

export function MessageList({ 
  messages, 
  loading, 
  activeTab, 
  selectedMessageId, 
  onSelectMessage 
}: MessageListProps) {
  // Helper function to get the name to display
  const getDisplayName = (message: any) => {
    if (activeTab === 'inbox') {
      const profile = message.profiles;
      return profile?.pet_name || profile?.email?.split('@')[0] || 'Unknown User';
    } else {
      const profile = message.profiles;
      return profile?.pet_name || profile?.email?.split('@')[0] || 'Unknown User';
    }
  };

  // Helper function to get avatar
  const getAvatar = (message: any) => {
    const profile = message.profiles;
    return profile?.profile_photo;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500">
          {activeTab === 'inbox' 
            ? 'Your inbox is empty' 
            : 'You haven\'t sent any messages yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-100">
        {messages.map((message) => {
          const isSelected = selectedMessageId === message.id;
          const isUnread = activeTab === 'inbox' && !message.is_read;
          
          return (
            <div 
              key={message.id}
              className={`p-4 cursor-pointer transition-colors ${isSelected 
                ? 'bg-orange-50' 
                : isUnread 
                  ? 'bg-orange-50/50 hover:bg-orange-50/70' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectMessage(message.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getAvatar(message) ? (
                    <img 
                      src={getAvatar(message)} 
                      alt={getDisplayName(message)}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {getDisplayName(message)}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm truncate mt-1 ${isUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    {message.content}
                  </p>
                  {isUnread && (
                    <span className="inline-block w-2 h-2 bg-[#D28000] rounded-full mt-1"></span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
