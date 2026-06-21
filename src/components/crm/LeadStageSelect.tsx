
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadStageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const LEAD_STAGES = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "texted", label: "Texted", color: "bg-yellow-100 text-yellow-800" },
  { value: "call_completed", label: "Call completed", color: "bg-purple-100 text-purple-800" },
  { value: "closed_won", label: "Closed – Won", color: "bg-green-100 text-green-800" },
  { value: "closed_lost", label: "Closed – Lost", color: "bg-red-100 text-red-800" },
];

export const LeadStageSelect = ({ value, onValueChange, disabled }: LeadStageSelectProps) => {
  const currentStage = LEAD_STAGES.find(stage => stage.value === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {currentStage && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStage.color}`}>
              {currentStage.label}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LEAD_STAGES.map((stage) => (
          <SelectItem key={stage.value} value={stage.value}>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
              {stage.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
