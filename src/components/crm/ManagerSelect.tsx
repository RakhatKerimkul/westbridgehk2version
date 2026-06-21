
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Manager {
  id: string;
  email: string;
  full_name?: string;
}

interface ManagerSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const ManagerSelect = ({ value, onValueChange, disabled }: ManagerSelectProps) => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagers();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading managers...</div>;
  }

  return (
    <Select value={value || "unassigned"} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select manager" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {managers.map((manager) => (
          <SelectItem key={manager.id} value={manager.id}>
            {manager.full_name || manager.email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
