import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Hackathon, HackathonTeam } from "@/types";
import { registrationService } from "@/services/registration/registration.service";
import { teamService } from "@/services/teams/team.service";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  hackathon: Hackathon;
}

export function RegistrationModal({ open, onOpenChange, hackathon }: Props) {
  const { toast } = useToast();
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hackathon.participationType === "team") {
      teamService.getMyTeams().then((res) => {
        setTeams(res.results);
      });
    }
  }, [hackathon.participationType]);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await registrationService.register(
        hackathon.id,
        hackathon.participationType === "team"
          ? selectedTeam ?? undefined
          : undefined
      );

      toast({
        title: "Registration submitted",
        description: "Your registration is pending approval",
      });

      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register for {hackathon.eventName}</DialogTitle>
        </DialogHeader>

        {hackathon.participationType === "team" && (
          <div className="space-y-3">
            <Label>Select a team</Label>
            <RadioGroup onValueChange={setSelectedTeam}>
              {teams.map((t) => (
                <div key={t.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={t.id} />
                  <Label>
                    {t.name} ({t.membersCount} members)
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            disabled={
              loading ||
              (hackathon.participationType === "team" && !selectedTeam)
            }
          >
            {loading ? "Submitting..." : "Confirm Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
