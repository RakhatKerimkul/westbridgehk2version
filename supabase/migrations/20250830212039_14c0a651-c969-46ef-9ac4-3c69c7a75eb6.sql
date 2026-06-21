-- Create table for Young CFO Weekend events
CREATE TABLE public.cfo_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Young CFO Weekend',
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL DEFAULT 'Hong Kong Convention & Exhibition Centre',
  location_details TEXT DEFAULT '1 Expo Drive, Wan Chai, Hong Kong, Meeting Room 301',
  description TEXT,
  max_participants INTEGER DEFAULT 50,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cfo_events ENABLE ROW LEVEL SECURITY;

-- Create policies for cfo_events
CREATE POLICY "Admins can view all events"
ON public.cfo_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can view all events"
ON public.cfo_events
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can create events"
ON public.cfo_events
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can create events"
ON public.cfo_events
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can update events"
ON public.cfo_events
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can update events"
ON public.cfo_events
FOR UPDATE
USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can delete events"
ON public.cfo_events
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cfo_events_updated_at
BEFORE UPDATE ON public.cfo_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();