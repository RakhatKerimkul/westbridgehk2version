import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, BookOpen, Shirt, UtensilsCrossed, MessageCircle, LogOut, CheckCircle, Circle, Camera, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ParentAuth = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Parent Portal</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Access your child's event information
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full py-2.5" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const ParentDashboard = () => {
  const { user } = useAuth();
  const [parentStudentData, setParentStudentData] = useState<{
    parent_name: string;
    student_name: string;
    student_age?: number;
    user_id?: string;
  } | null>(null);
  const [eventData, setEventData] = useState<{
    event_date: string;
    title: string;
    location: string;
    location_details: string;
    event_id?: string;
  } | null>(null);
  const [studentProgress, setStudentProgress] = useState<{
    photo_uploaded: boolean;
    quiz_completed: boolean;
    quiz_result: string | null;
    cfo_future_answer: string | null;
    cfo_motivation_answer: string | null;
    event_info_acknowledged: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const eventDate = eventData ? new Date(eventData.event_date) : null;
  const now = new Date();
  const timeLeft = eventDate ? eventDate.getTime() - now.getTime() : 0;
  const daysLeft = eventDate ? Math.ceil(timeLeft / (1000 * 60 * 60 * 24)) : 0;
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch parent-student data with event info
          const { data: parentData, error: parentError } = await supabase
            .from('parent_student_pairs')
            .select(`
              parent_name, 
              student_name, 
              student_age,
              event_id,
              user_id,
              cfo_events (
                id,
                event_date,
                title,
                location,
                location_details
              )
            `)
            .eq('user_id', user.id)
            .single();

          if (parentError) {
            console.error('Error fetching parent-student data:', parentError);
          } else {
            setParentStudentData({
              parent_name: parentData.parent_name,
              student_name: parentData.student_name,
              student_age: parentData.student_age,
              user_id: parentData.user_id
            });
            
            if (parentData.cfo_events) {
              setEventData({
                event_date: parentData.cfo_events.event_date,
                title: parentData.cfo_events.title,
                location: parentData.cfo_events.location,
                location_details: parentData.cfo_events.location_details,
                event_id: parentData.cfo_events.id
              });
              
              // Fetch student progress
              const { data: progressData, error: progressError } = await supabase
                .from('student_progress')
                .select('*')
                .eq('user_id', parentData.user_id)
                .eq('event_id', parentData.event_id)
                .single();

              if (!progressError && progressData) {
                setStudentProgress({
                  photo_uploaded: progressData.photo_uploaded,
                  quiz_completed: progressData.quiz_completed,
                  quiz_result: progressData.quiz_result,
                  cfo_future_answer: progressData.cfo_future_answer,
                  cfo_motivation_answer: progressData.cfo_motivation_answer,
                  event_info_acknowledged: progressData.event_info_acknowledged
                });
              }
            }
          }
        } catch (error) {
          console.error('Error in fetchData:', error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const calculateProgress = () => {
    if (!studentProgress) return 0;
    
    let completed = 0;
    const total = 4;
    
    if (studentProgress.photo_uploaded) completed++;
    if (studentProgress.quiz_completed) completed++;
    if (studentProgress.cfo_future_answer && studentProgress.cfo_motivation_answer) completed++;
    if (studentProgress.event_info_acknowledged) completed++;
    
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4 mx-auto max-w-md"></div>
              <div className="h-4 bg-muted rounded mx-auto max-w-xs"></div>
            </div>
          ) : parentStudentData ? (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-primary">
                Welcome, {parentStudentData.parent_name}!
              </h1>
              <div className="space-y-2">
                <p className="text-lg sm:text-xl font-semibold text-foreground">
                  Keep {parentStudentData.student_name} ready for Young CFO Weekend
                </p>
                <p className="text-base text-muted-foreground">
                  Your child's event information and updates
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Welcome to Parent Portal</h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Your child's Young CFO Weekend information
              </p>
            </>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Student Preparation Checklist */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Student Preparation Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Instructions - only show when not 100% complete */}
                {calculateProgress() !== 100 && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      📝 <strong>Important:</strong> Your child needs to log in to the Student Portal and complete these preparation steps before the event. The Student Portal link has been sent to you in a separate message.
                    </p>
                    <p className="text-xs text-blue-600">
                      Make sure {parentStudentData?.student_name || "your child"} uses the same login credentials to access their preparation checklist.
                    </p>
                  </div>
                )}
                
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Preparation Progress</h4>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${calculateProgress()}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{calculateProgress()}%</span>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
                
                {/* Checklist Items */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${studentProgress?.photo_uploaded ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`p-2 rounded-full ${studentProgress?.photo_uploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {studentProgress?.photo_uploaded ? <CheckCircle className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">CFO Passport Photo</p>
                      <p className="text-xs text-muted-foreground">{studentProgress?.photo_uploaded ? 'Uploaded' : 'Pending'}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${studentProgress?.quiz_completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`p-2 rounded-full ${studentProgress?.quiz_completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {studentProgress?.quiz_completed ? <CheckCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">CFO Style Assessment</p>
                      <p className="text-xs text-muted-foreground">
                        {studentProgress?.quiz_completed ? `${studentProgress.quiz_result} CFO` : 'Pending'}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${(studentProgress?.cfo_future_answer && studentProgress?.cfo_motivation_answer) ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`p-2 rounded-full ${(studentProgress?.cfo_future_answer && studentProgress?.cfo_motivation_answer) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {(studentProgress?.cfo_future_answer && studentProgress?.cfo_motivation_answer) ? <CheckCircle className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">CFO Aspirations</p>
                      <p className="text-xs text-muted-foreground">
                        {(studentProgress?.cfo_future_answer && studentProgress?.cfo_motivation_answer) ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${studentProgress?.event_info_acknowledged ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`p-2 rounded-full ${studentProgress?.event_info_acknowledged ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {studentProgress?.event_info_acknowledged ? <CheckCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Event Information</p>
                      <p className="text-xs text-muted-foreground">
                        {studentProgress?.event_info_acknowledged ? 'Reviewed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Completion Status */}
                {calculateProgress() === 100 && (
                  <div className="text-center mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
                    <div className="text-green-700 font-semibold mb-1">🎉 All Set!</div>
                    <p className="text-sm text-green-600">
                      {parentStudentData?.student_name} has completed all preparation tasks and is ready for the Young CFO Weekend!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Photos/Videos Info */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                Event Media
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center space-y-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary">
                  📸 Photos and Videos<br />Coming Soon!
                </div>
                <p className="text-base sm:text-lg font-medium">
                  After Young CFO Weekend ends, all photos and videos of your child will appear right here on this page.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Countdown */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                Time Until Event
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {eventData ? (daysLeft > 0 ? `${daysLeft} days` : 'Event started!') : 'Loading...'}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {eventData 
                    ? `${eventData.title} - ${new Date(eventData.event_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at ${new Date(eventData.event_date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}`
                    : 'Event details will be displayed here'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What Your Child Will Learn */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                What Your Child Will Learn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>• Financial literacy and budgeting</li>
                <li>• Leadership and decision-making</li>
                <li>• Business strategy and planning</li>
                <li>• Teamwork and communication</li>
                <li>• Entrepreneurship basics</li>
              </ul>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Event Location
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="font-medium text-sm sm:text-base">
                    {eventData?.location || 'Loading location...'}
                  </p>
                </div>
                <div className="w-full h-24 sm:h-32 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.3577!2d114.1576!3d22.2819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340400f5c43c7b5b%3A0x7f4e7f7f7f7f7f7f!2sCMA%20Building%2C%2064%20Connaught%20Rd%20Central%2C%20Central%2C%20Hong%20Kong!5e0!3m2!1sen!2shk!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Event Location Map"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dress Code */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shirt className="h-4 w-4 sm:h-5 sm:w-5" />
                What to Wear
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>• Business casual or smart casual</li>
                <li>• Collared shirt or blouse</li>
                <li>• Dress shoes (closed-toe)</li>
                <li>• Optional: Blazer or cardigan</li>
                <li>• Name tag will be provided</li>
              </ul>
            </CardContent>
          </Card>

          {/* Lunch Options */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
                Nearby Lunch Options
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="font-medium">Jollibee</p>
                  <p className="text-muted-foreground">1 min walk</p>
                </div>
                <div>
                  <p className="font-medium">RaRe Restaurant</p>
                  <p className="text-muted-foreground">1 min walk • Western cuisine</p>
                </div>
                <div>
                  <p className="font-medium">Food Court</p>
                  <p className="text-muted-foreground">3 min walk • Various options</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Contact */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Need Support?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button 
                  onClick={() => window.open('https://wa.me/85244880022', '_blank')}
                  className="flex items-center gap-2 w-full sm:w-auto text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden xs:inline">Contact us on WhatsApp: </span>
                  <span className="xs:hidden">WhatsApp: </span>
                  4488 0022
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out Button at the bottom */}
        <div className="mt-8 sm:mt-12 text-center">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="inline-flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

const Parent = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    if (user && role === 'parent') {
      setAuthSuccess(true);
    }
  }, [user, role]);

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

  if (!user || !authSuccess || role !== 'parent') {
    return <ParentAuth onSuccess={() => setAuthSuccess(true)} />;
  }

  return <ParentDashboard />;
};

export default Parent;