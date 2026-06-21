-- Create a table to store parent-student relationships
CREATE TABLE public.parent_student_pairs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.parent_student_pairs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own parent-student pair" 
ON public.parent_student_pairs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all parent-student pairs" 
ON public.parent_student_pairs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can view all parent-student pairs" 
ON public.parent_student_pairs 
FOR SELECT 
USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can insert parent-student pairs" 
ON public.parent_student_pairs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can insert parent-student pairs" 
ON public.parent_student_pairs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can update parent-student pairs" 
ON public.parent_student_pairs 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can update parent-student pairs" 
ON public.parent_student_pairs 
FOR UPDATE 
USING (has_role(auth.uid(), 'manager'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_parent_student_pairs_updated_at
BEFORE UPDATE ON public.parent_student_pairs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();