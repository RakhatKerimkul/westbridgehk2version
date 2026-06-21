
import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/auth/AuthPage";
import { CRMDashboard } from "@/components/crm/CRMDashboard";

const CRM = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-diploma-cream via-background to-diploma-cream flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return user ? <CRMDashboard /> : <AuthPage />;
};

export default CRM;
