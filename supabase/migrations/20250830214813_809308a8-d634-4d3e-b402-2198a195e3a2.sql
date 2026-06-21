-- Add event_id column to parent_student_pairs table
ALTER TABLE public.parent_student_pairs 
ADD COLUMN event_id UUID REFERENCES public.cfo_events(id) ON DELETE SET NULL;