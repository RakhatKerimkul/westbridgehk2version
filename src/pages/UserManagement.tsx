import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Copy, CheckCircle, UserPlus, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
  whatsappNumber?: string;
}

const UserManagementAuth = ({ onSuccess }: { onSuccess: () => void }) => {
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">User Management</CardTitle>
          <CardDescription>
            Sign in to manage users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const UserManagementDashboard = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '',
    parentName: '',
    studentName: '',
    studentAge: '',
    eventId: '',
    whatsappNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [copied, setCopied] = useState(false);
  const [studentNameForMessage, setStudentNameForMessage] = useState('');
  const [whatsappNumberForMessage, setWhatsappNumberForMessage] = useState('');

  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    const loadEvents = async () => {
      const { data, error } = await supabase
        .from('cfo_events')
        .select('id,title')
        .eq('is_active', true)
        .order('event_date', { ascending: true });
      if (!error && data) setEvents(data);
    };
    loadEvents();
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.role === 'parent-student' && (!formData.parentName || !formData.studentName || !formData.eventId)) {
    toast({
      title: "Missing data",
      description: "Please select an event and fill parent and student names.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: formData,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create user');
    }

    setCreatedUser(data.user);
    // Store student name and whatsapp for message if parent-student role
    if (formData.role === 'parent-student') {
      setStudentNameForMessage(formData.studentName);
    }
    setWhatsappNumberForMessage(formData.whatsappNumber);
    setFormData({ email: '', name: '', role: '', parentName: '', studentName: '', studentAge: '', eventId: '', whatsappNumber: '' });
    
    toast({
      title: "User created successfully",
      description: `${data.user.name} has been created with role ${data.user.role}`,
    });

  } catch (error: any) {
    toast({
      title: "Error creating user",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const handleWhatsAppSend = () => {
    if (!createdUser || !whatsappNumberForMessage) return;

    const parentName = createdUser.role === 'parent-student' ? createdUser.name : createdUser.name;
    const studentName = createdUser.role === 'parent-student' ? studentNameForMessage : createdUser.name;

    const message = `Dear ${parentName},

We are pleased to share the login details for both the Parent Portal and the Student Portal for The Young CFO Weekend.

🔑 Your Login Details
	•	Username: ${createdUser.email}
	•	Password: ${createdUser.password}

📌 Parent Portal: https://youngcfoweekend.com/parent
This portal contains important information for you as parents.

📌 Student Portal: https://youngcfoweekend.com/student
This portal contains essential preparation materials. Please make sure your child logs in and completes the preparation before the program.

👉 We kindly ask you to forward this message to ${studentName}, as they will need access to the Student Portal.

Thank you, and we look forward to seeing you at The Young CFO Weekend!`;

    const cleanNumber = whatsappNumberForMessage.replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyCredentials = async () => {
    if (!createdUser) return;

    const parentName = createdUser.role === 'parent-student' ? createdUser.name : createdUser.name;
    const studentName = createdUser.role === 'parent-student' ? studentNameForMessage : createdUser.name;

    const credentials = `Dear ${parentName},

We are pleased to share the login details for both the Parent Portal and the Student Portal for The Young CFO Weekend.

🔑 Your Login Details
	•	Username: ${createdUser.email}
	•	Password: ${createdUser.password}

📌 Parent Portal: https://youngcfoweekend.com/parent
This portal contains important information for you as parents.

📌 Student Portal: https://youngcfoweekend.com/student
This portal contains essential preparation materials. Please make sure your child logs in and completes the preparation before the program.

👉 We kindly ask you to forward this message to ${studentName}, as they will need access to the Student Portal.

Thank you, and we look forward to seeing you at The Young CFO Weekend!`;

    try {
      await navigator.clipboard.writeText(credentials);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "User credentials copied successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Create new users for parents, students, or parent-student pairs
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create User Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create New User
              </CardTitle>
              <CardDescription>
                Enter the user details below. A password will be generated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+852 1234 5678"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent-student">Parent-Student Pair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Parent-Student specific fields */}
                {formData.role === 'parent-student' && (
                  <>
                    <div>
                      <Label htmlFor="eventId">Event</Label>
                      <Select value={formData.eventId} onValueChange={(value) => setFormData({ ...formData, eventId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map((evt) => (
                            <SelectItem key={evt.id} value={evt.id}>{evt.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="parentName">Parent Name</Label>
                      <Input
                        id="parentName"
                        type="text"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input
                        id="studentName"
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="studentAge">Student Age</Label>
                      <Input
                        id="studentAge"
                        type="number"
                        value={formData.studentAge}
                        onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating User...' : 'Create User'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Created User Details */}
          {createdUser && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  User Created Successfully
                </CardTitle>
                <CardDescription className="text-green-600">
                  User account has been created. Share these credentials with the user.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-green-700">Name</Label>
                    <p className="font-medium">{createdUser.name}</p>
                  </div>
                  <div>
                    <Label className="text-green-700">Role</Label>
                    <p className="font-medium capitalize">{createdUser.role}</p>
                  </div>
                  <div>
                    <Label className="text-green-700">Email</Label>
                    <p className="font-medium">{createdUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-green-700">Password</Label>
                    <p className="font-medium font-mono bg-white px-2 py-1 rounded border">
                      {createdUser.password}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopyCredentials}
                    className="flex-1"
                    variant={copied ? "secondary" : "default"}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Credentials
                      </>
                    )}
                  </Button>

                  {whatsappNumberForMessage && (
                    <Button 
                      onClick={handleWhatsAppSend}
                      className="flex-1"
                      variant="outline"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send via WhatsApp
                    </Button>
                  )}
                </div>

                <div className="text-xs text-green-600 bg-white rounded p-2 border">
                  <strong>Login URL:</strong> {window.location.origin}/{createdUser.role === 'parent-student' ? 'parent' : createdUser.role}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [authSuccess, setAuthSuccess] = useState(false);

  const hasPermission = role === 'admin' || role === 'manager';

  useEffect(() => {
    if (user && hasPermission) {
      setAuthSuccess(true);
    }
  }, [user, hasPermission]);

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

  if (!user || !authSuccess || !hasPermission) {
    return <UserManagementAuth onSuccess={() => setAuthSuccess(true)} />;
  }

  return <UserManagementDashboard />;
};

export default UserManagement;