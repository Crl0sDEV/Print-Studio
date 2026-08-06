-- Run this in your Supabase SQL Editor to allow public file uploads

-- 1. Make sure the bucket exists and is set to PUBLIC
INSERT INTO storage.buckets (id, name, public) 
VALUES ('print_assets', 'print_assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow ANYONE (including anonymous customers) to upload files to this bucket
CREATE POLICY "Allow public uploads to print_assets" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'print_assets');

-- 3. Allow ANYONE to view/read the files
CREATE POLICY "Allow public viewing of print_assets" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'print_assets');
