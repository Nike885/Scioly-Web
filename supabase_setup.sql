-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor to create the missing chat_messages table

-- Create the chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to read messages
CREATE POLICY "Allow all users to read chat messages" ON public.chat_messages
    FOR SELECT USING (true);

-- Create a policy that allows all authenticated users to insert messages
CREATE POLICY "Allow all users to insert chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (true);

-- Create an index on timestamp for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON public.chat_messages(timestamp DESC);

-- Optional: Create an index on sender_id for filtering
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);

-- Grant necessary permissions
GRANT ALL ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO anon;

-- Insert a test message (optional)
INSERT INTO public.chat_messages (message, sender_name, sender_id) 
VALUES ('Welcome to the Science Olympiad chat! 🎉', 'System', 'system')
ON CONFLICT DO NOTHING; 