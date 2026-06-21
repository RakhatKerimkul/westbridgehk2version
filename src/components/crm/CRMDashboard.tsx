
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, DollarSign, TrendingUp, LogOut, Shield, UserCheck, Calendar } from "lucide-react";
import { LeadsTable } from "./LeadsTable";
import { LeadForm } from "./LeadForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

interface Lead {
  id: string;
  parent_name: string;
  email: string;
  whatsapp: string;
  teen_age: number;
  company?: string;
  stage: string;
  value?: number;
  notes?: string;
  assigned_to?: string;
  created_at: string;
}

interface Manager {
  id: string;
  email: string;
  full_name?: string;
}

interface StageStats {
  totalLeads: number;
  totalValue: number;
  wonDeals: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  negotiation: number;
  closed_won: number;
  closed_lost: number;
}

export const CRMDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { role, isAdmin, isManager, loading: roleLoading } = useUserRole();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!roleLoading && role) {
      fetchLeads();
      if (isAdmin) {
        fetchManagers();
      }
    }
  }, [role, roleLoading, isAdmin]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchManagers = async () => {
    try {
      // Получаем всех пользователей с ролью manager
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'manager');

      if (rolesError) throw rolesError;

      if (userRoles && userRoles.length > 0) {
        const userIds = userRoles.map(ur => ur.user_id);
        
        // Получаем профили этих пользователей
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        setManagers(profiles || []);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLead(null);
    fetchLeads();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const getStageStats = (): StageStats => {
    const stageDefaults = {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      closed_won: 0,
      closed_lost: 0,
    };

    const stats = leads.reduce((acc, lead) => {
      const stage = lead.stage as keyof typeof stageDefaults;
      if (stage in stageDefaults) {
        acc[stage] = (acc[stage] || 0) + 1;
      }
      return acc;
    }, { ...stageDefaults });

    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const wonDeals = leads.filter(lead => lead.stage === 'closed_won').length;
    
    return {
      totalLeads: leads.length,
      totalValue,
      wonDeals,
      ...stats
    };
  };

  // Показываем загрузку пока проверяем роль
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-diploma-cream via-background to-diploma-cream flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Если у пользователя нет роли, показываем сообщение
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-diploma-cream via-background to-diploma-cream flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>You don't have permission to access the CRM. Please contact an administrator.</p>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getStageStats();

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-diploma-cream via-background to-diploma-cream p-4">
        <div className="max-w-7xl mx-auto">
          <LeadForm
            lead={editingLead || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingLead(null);
            }}
            managers={managers}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-diploma-cream via-background to-diploma-cream p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold diploma-heading">CRM Dashboard</h1>
              {isAdmin && <Shield className="w-5 h-5 text-diploma-gold" />}
              {isManager && <UserCheck className="w-5 h-5 text-blue-600" />}
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Welcome back, {user?.email} ({role})
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => window.location.href = '/events'} 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Event Manager
            </Button>
            <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {isAdmin ? "Total Leads" : "My Leads"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalLeads}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Won Deals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.wonDeals}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">New Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.new || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>{isAdmin ? "All Leads" : "My Assigned Leads"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div>Loading leads...</div>
              </div>
            ) : (
              <LeadsTable
                leads={leads}
                managers={managers}
                onEdit={handleEdit}
                onRefresh={fetchLeads}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
