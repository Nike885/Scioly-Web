-- Create storage bucket for announcement images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('announcement-images', 'announcement-images', true)
ON CONFLICT (id) DO NOTHING;

-- Add image_url column to announcements table if it doesn't exist
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload announcement images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'announcement-images' 
  AND auth.role() = 'authenticated'
);

-- Create storage policy to allow public read access to announcement images
CREATE POLICY "Allow public read access to announcement images" ON storage.objects
FOR SELECT USING (bucket_id = 'announcement-images');

-- Create storage policy to allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated users to delete announcement images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'announcement-images' 
  AND auth.role() = 'authenticated'
); 