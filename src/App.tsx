import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CRM from "./pages/CRM";
import FAQ from "./pages/FAQ";
import Payment from "./pages/Payment";
import Deposit from "./pages/Deposit";
import Deposit2 from "./pages/Deposit2";
import Verify from "./pages/Verify";
import Quiz from "./pages/Quiz";
import Parent from "./pages/Parent";
import UserManagement from "./pages/UserManagement";
import EventManager from "./pages/EventManager";
import Student from "./pages/Student";
import StudentProgress from "./pages/StudentProgress";
import StudentProfiles from "./pages/StudentProfiles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/deposit2" element={<Deposit2 />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/parent" element={<Parent />} />
          <Route path="/student" element={<Student />} />
          <Route path="/student-progress" element={<StudentProgress />} />
          <Route path="/student-profiles" element={<StudentProfiles />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/events" element={<EventManager />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
