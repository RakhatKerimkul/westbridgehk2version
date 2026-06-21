-- Create table for tracking student progress
CREATE TABLE public.student_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID REFERENCES public.cfo_events(id),
  photo_uploaded BOOLEAN NOT NULL DEFAULT false,
  quiz_completed BOOLEAN NOT NULL DEFAULT false,
  quiz_result TEXT,
  event_info_viewed BOOLEAN NOT NULL DEFAULT false,
  attendance_confirmed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Enable Row Level Security
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for student progress access
CREATE POLICY "Students can view their own progress" 
ON public.student_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own progress" 
ON public.student_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own progress" 
ON public.student_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" 
ON public.student_progress 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can view all progress" 
ON public.student_progress 
FOR SELECT 
USING (has_role(auth.uid(), 'manager'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_progress_updated_at
BEFORE UPDATE ON public.student_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();