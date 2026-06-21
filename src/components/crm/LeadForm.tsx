
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadStageSelect } from "./LeadStageSelect";
import { ManagerSelect } from "./ManagerSelect";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id?: string;
  parent_name: string;
  email: string;
  whatsapp: string;
  teen_age: number;
  company?: string;
  stage: string;
  value?: number;
  notes?: string;
  assigned_to?: string;
}

interface Manager {
  id: string;
  email: string;
  full_name?: string;
}

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
  managers: Manager[];
  isAdmin: boolean;
}

export const LeadForm = ({ lead, onSuccess, onCancel, managers, isAdmin }: LeadFormProps) => {
  const [formData, setFormData] = useState<Lead>({
    parent_name: "",
    email: "",
    whatsapp: "",
    teen_age: 15,
    company: "",
    stage: "new",
    value: 0,
    notes: "",
    assigned_to: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const leadData = {
        ...formData,
        user_id: user.id,
        assigned_to: formData.assigned_to === "unassigned" ? null : formData.assigned_to,
      };

      if (lead?.id) {
        const { error } = await supabase
          .from('registrations')
          .update(leadData)
          .eq('id', lead.id);
        
        if (error) throw error;
        
        toast({
          title: "Lead Updated",
          description: "Lead has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('registrations')
          .insert(leadData);
        
        if (error) throw error;
        
        toast({
          title: "Lead Created",
          description: "New lead has been successfully created.",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{lead ? "Edit Lead" : "Create New Lead"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parent_name">Parent Name</Label>
              <Input
                id="parent_name"
                value={formData.parent_name}
                onChange={(e) => handleInputChange("parent_name", e.target.value)}
                placeholder="Enter parent name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                placeholder="Enter WhatsApp number"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="teen_age">Teen Age</Label>
              <Input
                id="teen_age"
                type="number"
                value={formData.teen_age}
                onChange={(e) => handleInputChange("teen_age", parseInt(e.target.value))}
                placeholder="Enter teen age"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div>
              <Label htmlFor="value">Value ($)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value || ""}
                onChange={(e) => handleInputChange("value", parseFloat(e.target.value))}
                placeholder="Enter deal value"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Stage</Label>
              <LeadStageSelect
                value={formData.stage}
                onValueChange={(value) => handleInputChange("stage", value)}
              />
            </div>
            
            {isAdmin && (
              <div>
                <Label>Assigned To</Label>
                <ManagerSelect
                  value={formData.assigned_to || "unassigned"}
                  onValueChange={(value) => handleInputChange("assigned_to", value)}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter notes about this lead..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
