
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { LeadStageSelect } from "./LeadStageSelect";
import { ManagerSelect } from "./ManagerSelect";
import { CallNotesDialog } from "./CallNotesDialog";
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

interface LeadsTableProps {
  leads: Lead[];
  managers: Manager[];
  onEdit: (lead: Lead) => void;
  onRefresh: () => void;
}

export const LeadsTable = ({ leads, managers, onEdit, onRefresh }: LeadsTableProps) => {
  const [updatingStages, setUpdatingStages] = useState<Set<string>>(new Set());
  const [updatingAssignments, setUpdatingAssignments] = useState<Set<string>>(new Set());
  const [callNotesDialog, setCallNotesDialog] = useState<{ open: boolean; leadId?: string; currentNotes?: string }>({
    open: false
  });
  const { toast } = useToast();
  const { isAdmin } = useUserRole();

  const handleStageChange = async (leadId: string, newStage: string) => {
    // If changing to "call_completed", require notes
    if (newStage === "call_completed") {
      const currentLead = leads.find(lead => lead.id === leadId);
      setCallNotesDialog({
        open: true,
        leadId,
        currentNotes: currentLead?.notes || ""
      });
      return;
    }

    setUpdatingStages(prev => new Set(prev).add(leadId));
    
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ stage: newStage })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Stage Updated",
        description: "Lead stage has been updated successfully.",
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingStages(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const handleCallNotesConfirm = async (notes: string) => {
    if (!callNotesDialog.leadId) return;

    setUpdatingStages(prev => new Set(prev).add(callNotesDialog.leadId!));
    
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          stage: "call_completed",
          notes: notes
        })
        .eq('id', callNotesDialog.leadId);

      if (error) throw error;

      toast({
        title: "Stage Updated",
        description: "Lead stage updated to Call Completed with notes.",
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingStages(prev => {
        const newSet = new Set(prev);
        newSet.delete(callNotesDialog.leadId!);
        return newSet;
      });
      setCallNotesDialog({ open: false });
    }
  };

  const handleManagerAssignment = async (leadId: string, managerId: string) => {
    setUpdatingAssignments(prev => new Set(prev).add(leadId));
    
    try {
      const assignedTo = managerId === "unassigned" ? null : managerId;
      
      const { error } = await supabase
        .from('registrations')
        .update({ assigned_to: assignedTo })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Assignment Updated",
        description: "Lead assignment has been updated successfully.",
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingAssignments(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }
  };

  const getManagerName = (managerId?: string) => {
    if (!managerId) return "Unassigned";
    const manager = managers.find(m => m.id === managerId);
    return manager?.full_name || manager?.email || "Unknown";
  };

  return (
    <div className="overflow-x-auto">
      <div className="rounded-md border min-w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Parent Name</TableHead>
              <TableHead className="min-w-[150px]">Email</TableHead>
              <TableHead className="min-w-[120px]">WhatsApp</TableHead>
              <TableHead className="min-w-[80px]">Teen Age</TableHead>
              <TableHead className="min-w-[200px]">Notes</TableHead>
              <TableHead className="min-w-[120px]">Stage</TableHead>
              {isAdmin && <TableHead className="min-w-[150px]">Assigned To</TableHead>}
              <TableHead className="min-w-[80px]">Value</TableHead>
              <TableHead className="min-w-[100px]">Created</TableHead>
              <TableHead className="min-w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.parent_name}</TableCell>
                <TableCell className="break-all">{lead.email}</TableCell>
                <TableCell>{lead.whatsapp}</TableCell>
                <TableCell>{lead.teen_age}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={lead.notes}>
                  {lead.notes || "-"}
                </TableCell>
                <TableCell>
                  <LeadStageSelect
                    value={lead.stage}
                    onValueChange={(newStage) => handleStageChange(lead.id, newStage)}
                    disabled={updatingStages.has(lead.id)}
                  />
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <ManagerSelect
                      value={lead.assigned_to || "unassigned"}
                      onValueChange={(managerId) => handleManagerAssignment(lead.id, managerId)}
                      disabled={updatingAssignments.has(lead.id)}
                    />
                  </TableCell>
                )}
                <TableCell>${lead.value || 0}</TableCell>
                <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(lead)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <CallNotesDialog
        open={callNotesDialog.open}
        onOpenChange={(open) => setCallNotesDialog({ open })}
        onConfirm={handleCallNotesConfirm}
        currentNotes={callNotesDialog.currentNotes}
      />
    </div>
  );
};
