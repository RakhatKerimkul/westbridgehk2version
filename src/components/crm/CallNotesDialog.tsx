import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CallNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (notes: string) => void;
  currentNotes?: string;
}

export const CallNotesDialog = ({ open, onOpenChange, onConfirm, currentNotes = "" }: CallNotesDialogProps) => {
  const [notes, setNotes] = useState(currentNotes);

  const handleSubmit = () => {
    if (notes.trim()) {
      onConfirm(notes.trim());
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setNotes(currentNotes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Call Notes Required</DialogTitle>
          <DialogDescription>
            Please provide details about the call before marking it as completed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="call-notes">Call Notes</Label>
            <Textarea
              id="call-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please include:
• Who are they?
• Why are they interested?
• How warm are they?
• Any other useful information..."
              rows={6}
              className="mt-2"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!notes.trim()}
            >
              Save & Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};