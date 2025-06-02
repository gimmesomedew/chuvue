'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { PageTransition } from '@/components/ui/PageTransition';
import { supabase } from '@/lib/supabase';
import { MessageList } from '@/components/messages/MessageList';
import { MessageView } from '@/components/messages/MessageView';
import { Inbox, Send } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function MessagesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/messages');
      showToast.error('You need to be logged in to view messages');
    } else if (user) {
      fetchMessages();
    }
  }, [user, isLoading, router, activeTab]);

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First fetch the messages
      let messagesQuery;
      
      if (activeTab === 'inbox') {
        // Fetch received messages
        messagesQuery = supabase
          .from('messages')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false });
      } else {
        // Fetch sent messages
        messagesQuery = supabase
          .from('messages')
          .select('*')
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });
      }
      
      const { data: messagesData, error: messagesError } = await messagesQuery;
      
      if (messagesError) throw messagesError;
      
      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }
      
      // Then fetch the profiles for the messages
      const profileIds = activeTab === 'inbox'
        ? messagesData.map(msg => msg.sender_id)
        : messagesData.map(msg => msg.recipient_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, pet_name, pet_breed, profile_photo, email')
        .in('id', profileIds);
      
      if (profilesError) throw profilesError;
      
      // Combine the data
      const combinedData = messagesData.map(message => {
        const profileId = activeTab === 'inbox' ? message.sender_id : message.recipient_id;
        const profile = profilesData?.find(p => p.id === profileId) || null;
        
        return {
          ...message,
          profiles: profile
        };
      });
      
      setMessages(combinedData || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showToast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessageId(messageId);
    
    // Mark as read if it's an inbox message
    if (activeTab === 'inbox') {
      const message = messages.find(msg => msg.id === messageId);
      if (message && !message.is_read) {
        markAsRead(messageId);
      }
    }
  };

  const handleSendReply = async (content: string, recipientId: string) => {
    if (!user || !content.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim()
        });
      
      if (error) throw error;
      
      showToast.success('Reply sent successfully');
      
      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      showToast.error('Failed to send reply');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {
                setActiveTab('inbox');
                setSelectedMessageId(null);
              }}
              className={`flex items-center px-4 py-2 font-medium ${activeTab === 'inbox' 
                ? 'text-[#D28000] border-b-2 border-[#D28000]' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Inbox className="w-4 h-4 mr-2" />
              Inbox
            </button>
            <button
              onClick={() => {
                setActiveTab('sent');
                setSelectedMessageId(null);
              }}
              className={`flex items-center px-4 py-2 font-medium ${activeTab === 'sent' 
                ? 'text-[#D28000] border-b-2 border-[#D28000]' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Send className="w-4 h-4 mr-2" />
              Sent
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Message List */}
            <div className="w-full md:w-1/3">
              <MessageList
                messages={messages}
                loading={loading}
                activeTab={activeTab}
                selectedMessageId={selectedMessageId}
                onSelectMessage={handleSelectMessage}
              />
            </div>
            
            {/* Message View */}
            <div className="w-full md:w-2/3">
              {selectedMessageId ? (
                <MessageView
                  message={messages.find(msg => msg.id === selectedMessageId)}
                  activeTab={activeTab}
                  onSendReply={handleSendReply}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                  <p>Select a message to view its contents</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
