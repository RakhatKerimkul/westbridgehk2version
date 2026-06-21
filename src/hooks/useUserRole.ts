import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<('admin' | 'manager' | 'parent' | 'student' | 'user')[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data: userRoles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching user role:', error);
            setRoles(['user']); // default fallback
          } else {
            const rolesList = userRoles?.map(r => r.role) || ['user'];
            setRoles(rolesList);
          }
        } catch (error) {
          console.error('Error in fetchUserRole:', error);
          setRoles(['user']); // default fallback
        }
      } else {
        setRoles([]);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [user]);

  // Helper computed values
  const primaryRole = roles.includes('admin') ? 'admin' 
    : roles.includes('manager') ? 'manager'
    : roles.includes('parent') ? 'parent'
    : roles.includes('student') ? 'student'
    : 'user';

  return { 
    roles,
    role: primaryRole, // для обратной совместимости
    loading,
    isAdmin: roles.includes('admin'),
    isManager: roles.includes('manager') || roles.includes('admin'),
    isParent: roles.includes('parent'),
    isStudent: roles.includes('student')
  };
};