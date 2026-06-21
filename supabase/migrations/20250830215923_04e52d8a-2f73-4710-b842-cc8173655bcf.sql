-- Add RLS policy for parents to view events they are assigned to
CREATE POLICY "Parents can view their assigned events" 
ON public.cfo_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.parent_student_pairs 
    WHERE parent_student_pairs.event_id = cfo_events.id 
    AND parent_student_pairs.user_id = auth.uid()
  )
);