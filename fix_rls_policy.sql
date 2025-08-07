-- Fix RLS Policy for Daily Quiz Results
-- Copy and paste this into your Supabase SQL Editor

-- First, drop the existing problematic policy
DROP POLICY IF EXISTS "Allow insert" ON public.daily_quiz_results;

-- Create a new, more permissive insert policy
CREATE POLICY "Allow authenticated users to insert quiz results" ON public.daily_quiz_results
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Also update the read policy to be more permissive
DROP POLICY IF EXISTS "Allow read own results" ON public.daily_quiz_results;

CREATE POLICY "Allow authenticated users to read quiz results" ON public.daily_quiz_results
    FOR SELECT 
    USING (auth.role() = 'authenticated'); 