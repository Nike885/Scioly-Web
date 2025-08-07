-- Temporarily disable RLS to fix the quiz
-- Copy and paste this into your Supabase SQL Editor

-- Disable RLS on the daily_quiz_results table
ALTER TABLE public.daily_quiz_results DISABLE ROW LEVEL SECURITY;

-- This will allow all operations on the table without RLS restrictions
-- You can re-enable it later with: ALTER TABLE public.daily_quiz_results ENABLE ROW LEVEL SECURITY; 