import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { LoginOnlyAuth } from '@/components/auth/LoginOnlyAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface StudentData {
  id: string;
  student_name: string;
  parent_name: string;
  student_age: number;
  event_id: string;
  user_id: string;
  event_title?: string;
  progress?: {
    quiz_completed: boolean;
    photo_uploaded: boolean;
    event_info_viewed: boolean;
    event_info_acknowledged: boolean;
    attendance_confirmed: boolean;
    cfo_motivation_answer: string;
    cfo_future_answer: string;
    quiz_result: string;
  };
}

const StudentProgress = () => {
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Record<string, string>>({});

  const isAuthorized = roles.includes('admin') || roles.includes('manager');

  useEffect(() => {
    if (user && isAuthorized) {
      fetchStudentData();
    }
  }, [user, isAuthorized]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch all parent-student pairs
      const { data: pairs, error: pairsError } = await supabase
        .from('parent_student_pairs')
        .select('*');

      if (pairsError) throw pairsError;

      // Fetch all student progress
      const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select('*');

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
      setEvents(eventsMap);

      // Combine data
      const studentsData: StudentData[] = pairs?.map(pair => {
        const studentProgress = progress?.find(p => p.user_id === pair.user_id);
        return {
          id: pair.id,
          student_name: pair.student_name,
          parent_name: pair.parent_name,
          student_age: pair.student_age,
          event_id: pair.event_id,
          user_id: pair.user_id,
          event_title: eventsMap[pair.event_id] || 'Unknown Event',
          progress: studentProgress ? {
            quiz_completed: studentProgress.quiz_completed,
            photo_uploaded: studentProgress.photo_uploaded,
            event_info_viewed: studentProgress.event_info_viewed,
            event_info_acknowledged: studentProgress.event_info_acknowledged,
            attendance_confirmed: studentProgress.attendance_confirmed,
            cfo_motivation_answer: studentProgress.cfo_motivation_answer,
            cfo_future_answer: studentProgress.cfo_future_answer,
            quiz_result: studentProgress.quiz_result
          } : undefined
        };
      }) || [];

      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Error",
        description: "Failed to load student progress data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (progress?: StudentData['progress']) => {
    if (!progress) return 0;
    
    const totalSteps = 5;
    let completedSteps = 0;
    
    if (progress.quiz_completed) completedSteps++;
    if (progress.photo_uploaded) completedSteps++;
    if (progress.event_info_viewed) completedSteps++;
    if (progress.event_info_acknowledged) completedSteps++;
    if (progress.attendance_confirmed) completedSteps++;
    
    return (completedSteps / totalSteps) * 100;
  };

  const getStatusBadge = (progress?: StudentData['progress']) => {
    if (!progress) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Not Started
      </Badge>;
    }

    const progressPercent = calculateProgress(progress);
    
    if (progressPercent === 100) {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Complete
      </Badge>;
    } else if (progressPercent > 0) {
      return <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        In Progress
      </Badge>;
    } else {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Not Started
      </Badge>;
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
            <h1 className="text-3xl font-bold text-primary mb-2">Student Progress</h1>
            <p className="text-muted-foreground">Admin/Manager access required</p>
          </div>
          <LoginOnlyAuth 
            title="Admin Sign In"
            description="Enter your credentials to access student progress"
          />
        </div>
      </div>
    );
  }

  const notStartedCount = students.filter(s => !s.progress).length;
  const inProgressCount = students.filter(s => s.progress && calculateProgress(s.progress) > 0 && calculateProgress(s.progress) < 100).length;
  const completedCount = students.filter(s => s.progress && calculateProgress(s.progress) === 100).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Student Progress Dashboard</h1>
          <p className="text-muted-foreground">Track student progress across all events</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Started</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{notStartedCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{inProgressCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Parent Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Quiz</TableHead>
                      <TableHead>Photo</TableHead>
                      <TableHead>Event Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.student_name}</TableCell>
                        <TableCell>{student.parent_name}</TableCell>
                        <TableCell>{student.student_age}</TableCell>
                        <TableCell>{student.event_title}</TableCell>
                        <TableCell>{getStatusBadge(student.progress)}</TableCell>
                        <TableCell className="w-32">
                          <div className="space-y-1">
                            <Progress value={calculateProgress(student.progress)} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {calculateProgress(student.progress).toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.progress?.quiz_completed ? (
                            <Badge variant="default" className="bg-green-600">✓</Badge>
                          ) : (
                            <Badge variant="secondary">✗</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.progress?.photo_uploaded ? (
                            <Badge variant="default" className="bg-green-600">✓</Badge>
                          ) : (
                            <Badge variant="secondary">✗</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.progress?.event_info_acknowledged ? (
                            <Badge variant="default" className="bg-green-600">✓</Badge>
                          ) : (
                            <Badge variant="secondary">✗</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProgress;