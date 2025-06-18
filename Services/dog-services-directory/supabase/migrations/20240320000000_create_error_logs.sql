-- Create user_roles table first
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'reviewer', 'pet_owner')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    error_message TEXT NOT NULL,
    action TEXT NOT NULL,
    context TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    stack_trace TEXT,
    additional_data JSONB
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_action ON error_logs(action);

-- Add RLS policies
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all error logs
CREATE POLICY "Admins can view all error logs"
    ON error_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Allow the system to insert error logs
CREATE POLICY "System can insert error logs"
    ON error_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create function to clean up old error logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM error_logs
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to run cleanup
CREATE OR REPLACE FUNCTION trigger_cleanup_old_logs()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run cleanup if we have more than 1000 logs
    IF (SELECT COUNT(*) FROM error_logs) > 1000 THEN
        PERFORM cleanup_old_error_logs();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run cleanup after insert
CREATE TRIGGER cleanup_old_logs_trigger
    AFTER INSERT ON error_logs
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_cleanup_old_logs(); 