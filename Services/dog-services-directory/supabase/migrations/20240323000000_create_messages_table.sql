-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to insert messages
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Allow users to read their own messages (sent or received)
CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Allow users to update is_read status of messages they received
CREATE POLICY "Users can mark received messages as read"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (
    auth.uid() = recipient_id 
    AND (
      -- Only allow updating is_read field
      (OLD.sender_id = NEW.sender_id)
      AND (OLD.recipient_id = NEW.recipient_id)
      AND (OLD.content = NEW.content)
      AND (OLD.created_at = NEW.created_at)
    )
  );

-- Allow users to delete their own messages
CREATE POLICY "Users can delete their own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id); 