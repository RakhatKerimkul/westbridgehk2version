import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { LoginOnlyAuth } from '@/components/auth/LoginOnlyAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, BookOpen, Camera } from 'lucide-react';

interface StudentProfile {
  id: string;
  student_name: string;
  parent_name: string;
  student_age: number;
  event_id: string;
  user_id: string;
  event_title?: string;
  photo_url?: string;
  cfo_motivation_answer?: string;
  cfo_future_answer?: string;
}

const StudentProfiles = () => {
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const isAuthorized = roles.includes('admin') || roles.includes('manager');

  useEffect(() => {
    if (user && isAuthorized) {
      fetchStudentProfiles();
    }
  }, [user, isAuthorized]);

  const fetchStudentProfiles = async () => {
    try {
      setLoading(true);

      // Fetch all parent-student pairs
      const { data: pairs, error: pairsError } = await supabase
        .from('parent_student_pairs')
        .select('*');

      if (pairsError) throw pairsError;

      // Fetch all student progress with essay answers
      const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select('user_id, cfo_motivation_answer, cfo_future_answer');

      if (progressError) throw progressError;

      // Fetch events for titles
      const { data: eventsData, error: eventsError } = await supabase
        .from('cfo_events')
        .select('id, title');

      if (eventsError) throw eventsError;

      // Create events map
      const eventsMap = eventsData?.reduce((acc, event) => {
        acc[event.id] = event.title;
        return acc;
      }, {} as Record<string, string>) || {};

      // Combine data and fetch photos
      const studentsData: StudentProfile[] = [];
      
      for (const pair of pairs || []) {
        const studentProgress = progress?.find(p => p.user_id === pair.user_id);
        
        // Try to fetch student photo
        let photoUrl: string | undefined;
        try {
          const { data: files } = await supabase.storage
            .from('student-photos')
            .list(pair.user_id);
          
          if (files && files.length > 0) {
            const { data } = supabase.storage
              .from('student-photos')
              .getPublicUrl(`${pair.user_id}/${files[0].name}`);
            photoUrl = data.publicUrl;
          }
        } catch (error) {
          console.log('No photo found for student:', pair.student_name);
        }

        studentsData.push({
          id: pair.id,
          student_name: pair.student_name,
          parent_name: pair.parent_name,
          student_age: pair.student_age,
          event_id: pair.event_id,
          user_id: pair.user_id,
          event_title: eventsMap[pair.event_id] || 'Unknown Event',
          photo_url: photoUrl,
          cfo_motivation_answer: studentProgress?.cfo_motivation_answer,
          cfo_future_answer: studentProgress?.cfo_future_answer
        });
      }

      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching student profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load student profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <Skeleton className="w-96 h-64" />
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Student Profiles</h1>
            <p className="text-muted-foreground">Admin/Manager access required</p>
          </div>
          <LoginOnlyAuth 
            title="Admin Sign In"
            description="Enter your credentials to access student profiles"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Student Profiles</h1>
          <p className="text-muted-foreground">View student photos and essay responses</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 relative">
                    {student.photo_url ? (
                      <img 
                        src={student.photo_url} 
                        alt={`${student.student_name}'s photo`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    {student.student_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Age: {student.student_age} | Parent: {student.parent_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Event: {student.event_title}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4" />
                      Motivation Essay
                    </h4>
                    {student.cfo_motivation_answer ? (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {student.cfo_motivation_answer}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No response submitted yet
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4" />
                      Future Plans Essay
                    </h4>
                    {student.cfo_future_answer ? (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {student.cfo_future_answer}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No response submitted yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && students.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground">No student profiles are available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfiles;