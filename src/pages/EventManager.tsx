import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Plus, Edit, Trash2, MapPin, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LoginOnlyAuth } from '@/components/auth/LoginOnlyAuth';

interface CFOEvent {
  id: string;
  title: string;
  event_date: string;
  location: string;
  location_details: string;
  description: string | null;
  max_participants: number;
  registration_deadline: string | null;
  is_active: boolean;
  created_at: string;
}

const EventForm = ({ 
  event, 
  onSuccess, 
  onCancel 
}: { 
  event?: CFOEvent; 
  onSuccess: () => void; 
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(event?.title || 'Young CFO Weekend');
  const [eventDate, setEventDate] = useState<Date>(
    event ? parseISO(event.event_date) : new Date()
  );
  const [eventTime, setEventTime] = useState(
    event ? format(parseISO(event.event_date), 'HH:mm') : '10:00'
  );
  const [location, setLocation] = useState(
    event?.location || 'Hong Kong Convention & Exhibition Centre'
  );
  const [locationDetails, setLocationDetails] = useState(
    event?.location_details || '1 Expo Drive, Wan Chai, Hong Kong, Meeting Room 301'
  );
  const [description, setDescription] = useState(event?.description || '');
  const [maxParticipants, setMaxParticipants] = useState(event?.max_participants || 50);
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | undefined>(
    event?.registration_deadline ? parseISO(event.registration_deadline) : undefined
  );
  const [deadlineTime, setDeadlineTime] = useState(
    event?.registration_deadline ? format(parseISO(event.registration_deadline), 'HH:mm') : '23:59'
  );
  const [isActive, setIsActive] = useState(event?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventDateTime = new Date(eventDate);
      const [hours, minutes] = eventTime.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));

      let registrationDeadlineDateTime = null;
      if (registrationDeadline) {
        registrationDeadlineDateTime = new Date(registrationDeadline);
        const [deadlineHours, deadlineMinutes] = deadlineTime.split(':');
        registrationDeadlineDateTime.setHours(
          parseInt(deadlineHours), 
          parseInt(deadlineMinutes)
        );
      }

      const eventData = {
        title,
        event_date: eventDateTime.toISOString(),
        location,
        location_details: locationDetails,
        description: description || null,
        max_participants: maxParticipants,
        registration_deadline: registrationDeadlineDateTime?.toISOString() || null,
        is_active: isActive,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      };

      let error;
      if (event) {
        ({ error } = await supabase
          .from('cfo_events')
          .update(eventData)
          .eq('id', event.id));
      } else {
        ({ error } = await supabase
          .from('cfo_events')
          .insert(eventData));
      }

      if (error) throw error;

      toast({
        title: event ? 'Event updated' : 'Event created',
        description: `${title} has been ${event ? 'updated' : 'created'} successfully.`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Event Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !eventDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={eventDate}
                onSelect={(date) => date && setEventDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="eventTime">Event Time</Label>
          <Input
            id="eventTime"
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="maxParticipants">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            min="1"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="locationDetails">Location Details</Label>
          <Input
            id="locationDetails"
            value={locationDetails}
            onChange={(e) => setLocationDetails(e.target.value)}
          />
        </div>

        <div>
          <Label>Registration Deadline (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !registrationDeadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {registrationDeadline 
                  ? format(registrationDeadline, "PPP") 
                  : <span>Pick deadline date</span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={registrationDeadline}
                onSelect={setRegistrationDeadline}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="deadlineTime">Deadline Time</Label>
          <Input
            id="deadlineTime"
            type="time"
            value={deadlineTime}
            onChange={(e) => setDeadlineTime(e.target.value)}
            disabled={!registrationDeadline}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add event description..."
          />
        </div>

        <div className="sm:col-span-2 flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="isActive">Active Event</Label>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

const EventManager = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [events, setEvents] = useState<CFOEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CFOEvent | undefined>();
  const { toast } = useToast();

  const hasAccess = role === 'admin' || role === 'manager';

  useEffect(() => {
    if (hasAccess) {
      loadEvents();
    }
  }, [hasAccess]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('cfo_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading events',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('cfo_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: 'Event deleted',
        description: 'Event has been deleted successfully.',
      });
      loadEvents();
    } catch (error: any) {
      toast({
        title: 'Error deleting event',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginOnlyAuth 
        title="Event Manager Login"
        description="Sign in to manage Young CFO Weekend events"
      />
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need admin or manager privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Event Manager</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Manage Young CFO Weekend events
            </p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingEvent(undefined)}>
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </DialogTitle>
              </DialogHeader>
              <EventForm
                event={editingEvent}
                onSuccess={() => {
                  setShowForm(false);
                  setEditingEvent(undefined);
                  loadEvents();
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingEvent(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {events.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No events created yet.</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setShowForm(true)}
                  >
                    Create Your First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id} className={cn(
                  "relative",
                  !event.is_active && "opacity-60"
                )}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl">
                          {event.title}
                          {!event.is_active && (
                            <span className="ml-2 text-sm bg-muted text-muted-foreground px-2 py-1 rounded">
                              Inactive
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingEvent(event);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {format(parseISO(event.event_date), 'PPP')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(event.event_date), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{event.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.location_details}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Max {event.max_participants} participants
                          </p>
                          {event.registration_deadline && (
                            <p className="text-xs text-muted-foreground">
                              Deadline: {format(parseISO(event.registration_deadline), 'PPp')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManager;