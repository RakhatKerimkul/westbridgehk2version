-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public) VALUES ('student-photos', 'student-photos', true);

-- Create policies for student photo uploads
CREATE POLICY "Students can upload their own photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can view their own photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can update their own photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'student-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can delete their own photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'student-photos' AND auth.uid()::text = (storage.foldername(name))[1]);