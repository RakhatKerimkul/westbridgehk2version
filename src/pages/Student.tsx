import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { LoginOnlyAuth } from '@/components/auth/LoginOnlyAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, LogOut, CheckCircle, Circle, Calendar, FileText, Users, Award, ArrowLeft, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Student = () => {
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [studentInfo, setStudentInfo] = useState<{
    studentName: string;
    eventDate: string;
    eventTime: string;
    eventId: string;
    location: string;
    locationDetails: string;
    eventDateTime: Date; // Add original datetime for countdown
  } | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [cfoStyle, setCfoStyle] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'dashboard' | 'passport' | 'quiz' | 'quiz-result' | 'cfo-questions' | 'event-info'>('dashboard');
  const [cfoFutureAnswer, setCfoFutureAnswer] = useState('');
  const [cfoMotivationAnswer, setCfoMotivationAnswer] = useState('');
  const [eventInfoAcknowledged, setEventInfoAcknowledged] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate countdown timer
  useEffect(() => {
    if (!studentInfo?.eventDateTime) return;

    const updateCountdown = () => {
      // Use the original datetime from the database
      if (!studentInfo?.eventDateTime) return;
      
      const now = new Date();
      const difference = studentInfo.eventDateTime.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [studentInfo?.eventDateTime]);

  const isStudent = roles.includes('student') || roles.includes('admin');

  useEffect(() => {
    if (user && isStudent) {
      loadStudentInfo();
      loadExistingPhoto();
    }
  }, [user, isStudent]);

  const loadStudentInfo = async () => {
    if (!user) return;
    
    try {
      // Get student info from parent_student_pairs and event info
      const { data: studentData, error: studentError } = await supabase
        .from('parent_student_pairs')
        .select(`
          student_name,
          event_id,
          cfo_events (
            id,
            event_date,
            location,
            location_details
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (studentError) {
        console.error('Error loading student info:', studentError);
        return;
      }

      if (studentData && studentData.cfo_events) {
        const eventDateTime = new Date(studentData.cfo_events.event_date);
        const eventDateTimeFormatted = eventDateTime.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) + ' ' + eventDateTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        setStudentInfo({
          studentName: studentData.student_name,
          eventDate: eventDateTimeFormatted,
          eventTime: '', // Not needed anymore since we combine date and time
          eventId: studentData.event_id || studentData.cfo_events.id,
          location: studentData.cfo_events.location || 'Hong Kong Convention & Exhibition Centre',
          locationDetails: studentData.cfo_events.location_details || '1 Expo Drive, Wan Chai, Hong Kong, Meeting Room 301',
          eventDateTime: eventDateTime // Keep original datetime for countdown
        });
        
        // Load progress after getting student info
        loadProgress(studentData.event_id || studentData.cfo_events.id);
      }
    } catch (error) {
      console.error('Error loading student info:', error);
    }
  };

  const loadProgress = async (eventId: string) => {
    if (!user) return;
    
    try {
      setLoadingProgress(true);
      const { data: progressData, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error loading progress:', error);
        return;
      }

      if (progressData) {
        setQuizCompleted(progressData.quiz_completed);
        setCfoStyle(progressData.quiz_result);
        setCfoFutureAnswer(progressData.cfo_future_answer || '');
        setCfoMotivationAnswer(progressData.cfo_motivation_answer || '');
        setEventInfoAcknowledged(progressData.event_info_acknowledged || false);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const updateProgress = async (updates: {
    photo_uploaded?: boolean;
    quiz_completed?: boolean;
    quiz_result?: string;
    cfo_future_answer?: string;
    cfo_motivation_answer?: string;
    event_info_acknowledged?: boolean;
  }) => {
    if (!user || !studentInfo?.eventId) return;

    try {
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          user_id: user.id,
          event_id: studentInfo.eventId,
          ...updates
        }, {
          onConflict: 'user_id,event_id'
        });

      if (error) {
        console.error('Error updating progress:', error);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const loadExistingPhoto = async () => {
    if (!user) return;
    
    try {
      setLoadingPhoto(true);
      const { data, error } = await supabase.storage
        .from('student-photos')
        .list(`${user.id}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading photos:', error);
        return;
      }

      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from('student-photos')
          .getPublicUrl(`${user.id}/${data[0].name}`);
        
        setPhotoUrl(urlData.publicUrl);
      }
    } catch (error) {
      console.error('Error loading existing photo:', error);
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      
      // Create custom filename with student name and event date
      let fileName = `passport-photo.${fileExt}`;
      if (studentInfo) {
        // Clean the student name for filename (remove special characters)
        const cleanStudentName = studentInfo.studentName.replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, '_');
        fileName = `${cleanStudentName}_${studentInfo.eventDate.replace(/\./g, '-')}.${fileExt}`;
      }
      
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('student-photos')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('student-photos')
        .getPublicUrl(filePath);

      setPhotoUrl(urlData.publicUrl);
      
      // Update progress in database
      await updateProgress({ photo_uploaded: true });
      
      toast({
        title: "Photo uploaded successfully!",
        description: "Your CFO passport is now ready",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been logged out",
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const calculateProgress = () => {
    let completed = 0;
    const total = 4; // Total checklist items
    
    if (photoUrl) completed++;
    if (quizCompleted) completed++;
    if (cfoFutureAnswer && cfoMotivationAnswer) completed++;
    if (eventInfoAcknowledged) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const handleCfoQuestionsSubmit = async () => {
    if (!cfoFutureAnswer.trim() || !cfoMotivationAnswer.trim()) {
      toast({
        title: "Please answer both questions",
        description: "Both questions are required",
        variant: "destructive"
      });
      return;
    }

    await updateProgress({ 
      cfo_future_answer: cfoFutureAnswer,
      cfo_motivation_answer: cfoMotivationAnswer
    });

    toast({
      title: "Answers saved successfully!",
      description: "Your responses have been recorded",
    });

    setCurrentSection('dashboard');
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
        <Skeleton className="w-full max-w-sm h-64" />
      </div>
    );
  }

  if (!user || !isStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Student Portal</h1>
            <p className="text-sm text-muted-foreground">Please sign in to access your CFO passport</p>
          </div>
          <LoginOnlyAuth 
            title="Student Sign In"
            description="Enter your credentials to access the student portal"
          />
        </div>
      </div>
    );
  }

  // Handle navigation to different sections
  if (currentSection === 'passport' && photoUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-3 py-4 sm:p-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <CFOPassport photoUrl={photoUrl} user={user} studentName={studentInfo?.studentName || ''} />
        </div>
      </div>
    );
  }

  if (currentSection === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-3 py-4 sm:p-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <CFOStyleQuiz 
            onComplete={async (style) => {
              setCfoStyle(style);
              setQuizCompleted(true);
              await updateProgress({ quiz_completed: true, quiz_result: style });
              setCurrentSection('quiz-result');
            }} 
          />
        </div>
      </div>
    );
  }

  if (currentSection === 'quiz-result' && cfoStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-3 py-4 sm:p-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <CFOStyleResult style={cfoStyle} />
          <div className="text-center mt-6 sm:mt-8">
            <Button 
              onClick={() => setCurrentSection('dashboard')}
              className="w-full max-w-md h-12 text-base"
              size="lg"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentSection === 'cfo-questions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-3 py-4 sm:p-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                How Much of a CFO Are You?
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      1. Do you see yourself as a future CFO, or are you just exploring the role for now?
                    </label>
                    <textarea
                      value={cfoFutureAnswer}
                      onChange={(e) => setCfoFutureAnswer(e.target.value)}
                      className="w-full p-4 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-base"
                      rows={4}
                      placeholder="Share your thoughts about your future CFO aspirations..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      2. Why do you feel this way? What motivates (or stops) you?
                    </label>
                    <textarea
                      value={cfoMotivationAnswer}
                      onChange={(e) => setCfoMotivationAnswer(e.target.value)}
                      className="w-full p-4 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-base"
                      rows={4}
                      placeholder="Explain what drives your interest or concerns about being a CFO..."
                    />
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <Button 
                    className="w-full max-w-md h-12 text-base" 
                    size="lg"
                    onClick={handleCfoQuestionsSubmit}
                    disabled={!cfoFutureAnswer.trim() || !cfoMotivationAnswer.trim()}
                  >
                    Save My Answers
                  </Button>
                  {(cfoFutureAnswer.trim() && cfoMotivationAnswer.trim()) && (
                    <p className="text-xs text-muted-foreground">
                      Both questions answered - ready to save!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentSection === 'event-info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-3 py-4 sm:p-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Young CFO Weekend Hong Kong</h3>
                  <p className="text-muted-foreground mb-6">
                    Join fellow young leaders for an intensive weekend of financial education, 
                    networking, and hands-on business experience that will shape your future in finance.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Event Date and Location */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Event Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                          <p className="font-semibold">{studentInfo?.location || 'Loading location...'}</p>
                          <div className="mt-3 w-full h-24 sm:h-32 rounded-lg overflow-hidden">
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
                        {studentInfo && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Event Date & Time</p>
                            <p className="font-semibold text-lg text-primary">{studentInfo.eventDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* What You Will Learn */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      What You Will Learn
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Financial literacy and budgeting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Leadership and decision-making
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Business strategy and planning
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Teamwork and communication
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Entrepreneurship basics
                      </li>
                    </ul>
                  </div>

                  {/* What to Wear */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      What to Wear
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Business casual or smart casual
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Collared shirt or blouse
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Dress shoes (closed-toe)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Optional: Blazer or cardigan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Name tag will be provided
                      </li>
                    </ul>
                  </div>

                  {/* Nearby Lunch Options */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Nearby Lunch Options
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">Jollibee</p>
                        <p className="text-muted-foreground">1 min walk</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">RaRe Restaurant</p>
                        <p className="text-muted-foreground">1 min walk • Western cuisine</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">Food Court</p>
                        <p className="text-muted-foreground">3 min walk • Various options</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Important Note
                  </h4>
                  <p className="text-sm text-amber-700">
                    Please arrive 15 minutes early for registration. All learning materials will be provided. 
                    If you have any questions, contact us on WhatsApp: 4488 0022
                  </p>
                </div>
                
                <div className="text-center space-y-4 pt-4">
                  <Button 
                    className="w-full max-w-md h-12 text-base" 
                    size="lg"
                    onClick={async () => {
                      setEventInfoAcknowledged(true);
                      await updateProgress({ event_info_acknowledged: true });
                      
                      toast({
                        title: "Information acknowledged!",
                        description: "Thank you for reviewing the event details",
                      });

                      setCurrentSection('dashboard');
                    }}
                    disabled={eventInfoAcknowledged}
                  >
                    {eventInfoAcknowledged ? 'Information Acknowledged ✓' : 'I Have Read and Understood'}
                  </Button>
                  {eventInfoAcknowledged && (
                    <p className="text-xs text-green-600">
                      ✓ You have successfully acknowledged the event information
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 px-3 py-4 sm:p-4 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        {studentInfo && (
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                Welcome, {studentInfo.studentName}! 👋
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Ready to prepare for the Young CFO Weekend on {studentInfo.eventDate}?
              </p>
            </CardContent>
          </Card>
        )}

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">Young CFO Preparation</h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2">Complete your checklist to be ready for the event</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Preparation Progress</h3>
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

            {/* Congratulations and Countdown Timer - shown when 100% complete */}
            {calculateProgress() === 100 && (
              <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6 text-center">
                  <div className="space-y-4">
                    <div className="text-4xl mb-2">🎉</div>
                    <h2 className="text-2xl font-bold text-green-700">You Are All Set!</h2>
                    <p className="text-green-600 mb-6">
                      Congratulations! You've completed all preparation tasks for the Young CFO Weekend.
                    </p>
                    
                    {/* Countdown Timer */}
                    <div className="bg-white rounded-lg p-6 border border-green-200">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-700">Event Countdown</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto">
                        <div className="text-center">
                          <div className="bg-green-100 rounded-lg p-2 sm:p-3">
                            <div className="text-xl sm:text-2xl font-bold text-green-700">{timeLeft.days}</div>
                            <div className="text-xs text-green-600 uppercase tracking-wide">Days</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-green-100 rounded-lg p-2 sm:p-3">
                            <div className="text-xl sm:text-2xl font-bold text-green-700">{timeLeft.hours}</div>
                            <div className="text-xs text-green-600 uppercase tracking-wide">Hours</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-green-100 rounded-lg p-2 sm:p-3">
                            <div className="text-xl sm:text-2xl font-bold text-green-700">{timeLeft.minutes}</div>
                            <div className="text-xs text-green-600 uppercase tracking-wide">Min</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-green-100 rounded-lg p-2 sm:p-3">
                            <div className="text-xl sm:text-2xl font-bold text-green-700">{timeLeft.seconds}</div>
                            <div className="text-xs text-green-600 uppercase tracking-wide">Sec</div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="mt-4 text-sm text-green-600">
                        See you at the Young CFO Weekend Hong Kong!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <ChecklistItem
                icon={<Camera className="h-5 w-5" />}
                title="Upload CFO Passport Photo"
                description="Take a professional photo for your CFO passport"
                completed={!!photoUrl}
                action={!photoUrl ? (
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button 
                        className="w-full"
                        onClick={() => document.getElementById('photo-camera')?.click()}
                        disabled={uploading}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Take Photo'}
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById('photo-gallery')?.click()}
                        disabled={uploading}
                      >
                        📷 Gallery
                      </Button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                      id="photo-camera"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                      id="photo-gallery"
                    />
                  </div>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentSection('passport')}
                  >
                    View CFO Passport
                  </Button>
                )}
                content={photoUrl && (
                  <div className="mt-4">
                    <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 mx-auto">
                      <img 
                        src={photoUrl} 
                        alt="Student Photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => document.getElementById('photo-camera-update')?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => document.getElementById('photo-gallery-update')?.click()}
                      >
                        📷 Gallery
                      </Button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                      id="photo-camera-update"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                      id="photo-gallery-update"
                    />
                  </div>
                )}
              />

              <ChecklistItem
                icon={<FileText className="h-5 w-5" />}
                title="Take CFO Style Assessment"
                description="Discover your leadership style with our comprehensive quiz"
                completed={quizCompleted}
                action={photoUrl && !quizCompleted ? (
                  <Button 
                    onClick={() => setCurrentSection('quiz')}
                    className="w-full"
                  >
                    Start Assessment
                  </Button>
                ) : quizCompleted ? (
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentSection('quiz-result')}
                    className="w-full"
                  >
                    View Your Result
                  </Button>
                ) : null}
                content={quizCompleted && cfoStyle && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium">{cfoStyle} CFO</span>
                    </div>
                  </div>
                )}
                disabled={!photoUrl}
              />

              <ChecklistItem
                icon={<Users className="h-5 w-5" />}
                title="How Much of a CFO Are You?"
                description="Answer two questions about your CFO aspirations and motivations"
                completed={!!(cfoFutureAnswer && cfoMotivationAnswer)}
                action={
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setCurrentSection('cfo-questions')}
                  >
                    {(cfoFutureAnswer && cfoMotivationAnswer) ? 'Review Answers' : 'Answer Questions'}
                  </Button>
                }
              />

              <ChecklistItem
                icon={<FileText className="h-5 w-5" />}
                title="Review Event Information"
                description="Read important details about the Young CFO Weekend"
                completed={eventInfoAcknowledged}
                action={
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setCurrentSection('event-info')}
                  >
                    {eventInfoAcknowledged ? 'Review Again' : 'Read Event Info'}
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Sign Out Button */}
        <div className="mt-12 flex justify-center">
          <Button 
            variant="ghost"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

interface CFOPassportProps {
  photoUrl: string;
  user: any;
  studentName: string;
}

const CFOPassport = ({ photoUrl, user, studentName }: CFOPassportProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 sm:p-8 rounded-lg shadow-2xl border-4 border-yellow-400 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-inner">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900">CFO PASSPORT</h2>
            <p className="text-xs sm:text-sm text-blue-700">Young Chief Financial Officer</p>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm sm:text-lg">CFO</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="w-48 sm:w-full max-w-[200px] aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
              <img 
                src={photoUrl} 
                alt="Student Photo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
                <p className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 break-all">
                  {studentName || 'Student'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">ID Number</label>
                <p className="text-base sm:text-lg font-mono text-gray-900 border-b border-gray-300 pb-1">
                  CFO{user.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Role</label>
                <p className="text-base sm:text-lg font-semibold text-blue-900 border-b border-gray-300 pb-1">
                  Young CFO
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Issue Date</label>
                <p className="text-base sm:text-lg text-gray-900 border-b border-gray-300 pb-1">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Program</label>
              <p className="text-base sm:text-lg font-semibold text-green-700 border-b border-gray-300 pb-1">
                Young CFO Weekend Hong Kong
              </p>
            </div>
            
            <div className="pt-4">
              <div className="w-24 sm:w-32 h-6 sm:h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This passport certifies participation in the Young CFO Weekend program. 
            Valid for program duration and related activities.
          </p>
        </div>
      </div>
    </div>
  );
};

interface CFOStyleQuizProps {
  onComplete: (style: string) => void;
}

const CFOStyleQuiz = ({ onComplete }: CFOStyleQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    {
      question: "You're planning a summer business with friends. What's your approach?",
      options: [
        "Research the market thoroughly and create detailed financial projections", // Analytical
        "Start small with proven ideas to minimize risk", // Conservative
        "Go big with an innovative concept that could revolutionize the market", // Risk-taking
        "Focus on building a strong team and inspiring everyone to success" // Charismatic
      ]
    },
    {
      question: "Your school club has $500 budget for an event. How do you allocate it?",
      options: [
        "Keep $150 as emergency fund, spend $350 on essentials", // Conservative
        "Invest all $500 in an amazing venue to create unforgettable experience", // Risk-taking
        "Use Excel to optimize spending across 15 categories for maximum impact", // Analytical
        "Rally the team to contribute extra funds and create something extraordinary" // Charismatic
      ]
    },
    {
      question: "A tech startup offers you internship equity instead of salary. You:",
      options: [
        "Negotiate for both - some salary plus smaller equity stake", // Analytical
        "Take the equity - this could be the next unicorn!", // Risk-taking
        "Ask for guaranteed salary - you need stable income", // Conservative
        "Join if you believe in the founder's vision and can help shape culture" // Charismatic
      ]
    },
    {
      question: "You're presenting your business idea to potential investors. Your strategy:",
      options: [
        "Show compelling vision and get them excited about changing the world", // Charismatic
        "Present conservative projections with multiple backup plans", // Conservative
        "Highlight the massive market opportunity and potential 10x returns", // Risk-taking
        "Share detailed spreadsheets proving every assumption with data" // Analytical
      ]
    },
    {
      question: "Your friend asks you to invest your savings in their cryptocurrency venture:",
      options: [
        "Politely decline - too volatile for your comfort", // Conservative
        "Invest 50% - high risk but potentially high reward", // Risk-taking
        "Research the technology, team, and market for 2 weeks first", // Analytical
        "Only if you can actively help and believe in their leadership" // Charismatic
      ]
    },
    {
      question: "Leading a group project, your primary focus is:",
      options: [
        "Creating detailed timelines and tracking every milestone", // Analytical
        "Ensuring everyone feels motivated and engaged", // Charismatic
        "Setting realistic goals that the team can definitely achieve", // Conservative
        "Pushing for ambitious objectives that will impress everyone" // Risk-taking
      ]
    },
    {
      question: "You discover a financial error that benefits your company. You:",
      options: [
        "Immediately investigate to understand the root cause", // Analytical
        "Report it right away - integrity is non-negotiable", // Conservative
        "Use this as opportunity to propose new financial systems", // Risk-taking
        "Discuss with the team to ensure everyone learns from this" // Charismatic
      ]
    },
    {
      question: "Your investment philosophy for the next 5 years:",
      options: [
        "Diversified portfolio with strong fundamentals", // Conservative
        "Growth stocks and emerging markets for maximum potential", // Risk-taking
        "Data-driven decisions based on quantitative analysis", // Analytical
        "Invest in companies whose missions align with your values" // Charismatic
      ]
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate CFO style based on answers
      const styles = ["Analytical", "Intuitive", "Collaborative", "Strategic"];
      const counts = [0, 0, 0, 0];
      
      newAnswers.forEach(answer => {
        counts[answer]++;
      });
      
      const maxIndex = counts.indexOf(Math.max(...counts));
      onComplete(styles[maxIndex]);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-6 w-6" />
          CFO Style Assessment
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <p className="text-base mb-6">{questions[currentQuestion].question}</p>
          </div>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CFOStyleResultProps {
  style: string;
}

const CFOStyleResult = ({ style }: CFOStyleResultProps) => {
  const getStyleDescription = (style: string) => {
    switch (style) {
      case "Analytical":
        return "You excel at breaking down complex financial problems and making data-driven decisions. Your strength lies in thorough analysis and attention to detail.";
      case "Intuitive":
        return "You have a natural feel for business and can quickly identify opportunities and risks. Your experience and instincts guide your financial leadership.";
      case "Collaborative":
        return "You believe in the power of teamwork and diverse perspectives. Your inclusive approach ensures buy-in and better decision-making across the organization.";
      case "Strategic":
        return "You focus on the big picture and long-term value creation. Your ability to align financial decisions with strategic goals sets you apart.";
      default:
        return "Your unique combination of skills makes you a well-rounded financial leader.";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">Your CFO Style</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="bg-primary/10 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-primary mb-4">{style} CFO</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {getStyleDescription(style)}
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            🎯 This style will be reflected in your CFO Passport and help match you with relevant opportunities during the event.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface ChecklistItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  completed: boolean;
  action?: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

const ChecklistItem = ({ icon, title, description, completed, action, content, disabled = false }: ChecklistItemProps) => {
  return (
    <div className={`border rounded-lg p-4 ${completed ? 'bg-green-50 border-green-200' : disabled ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${completed ? 'bg-green-100 text-green-600' : disabled ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'}`}>
          {completed ? <CheckCircle className="h-5 w-5" /> : icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${disabled ? 'text-gray-400' : 'text-foreground'}`}>{title}</h4>
            {completed && <span className="text-xs text-green-600 font-medium">Completed</span>}
          </div>
          <p className={`text-sm mb-3 ${disabled ? 'text-gray-400' : 'text-muted-foreground'}`}>{description}</p>
          
          {action && !disabled && (
            <div className="mb-3">
              {action}
            </div>
          )}
          
          {content}
        </div>
      </div>
    </div>
  );
};

export default Student;