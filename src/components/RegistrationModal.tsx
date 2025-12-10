import { useState } from "react";
import { Plus, Trash2, Users, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Hackathon, TeamMember } from "@/types";
import { registrationService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { mockTeams } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RegistrationModalProps {
  hackathon: Hackathon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationModal({
  hackathon,
  open,
  onOpenChange,
}: RegistrationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamOption, setTeamOption] = useState<"existing" | "temporary">(
    "existing"
  );
  const [teamName, setTeamName] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "Yadnesh Gawas", email: "yadnesh@example.com", role: "Team Lead" },
    { name: "Rohan Patil", email: "rohan@example.com", role: "Developer" },
    { name: "Sneha Kulkarni", email: "sneha@example.com", role: "Designer" },
    { name: "Amit Desai", email: "amit@example.com", role: "QA Engineer" },
  ]);

  // Get user's current team (mock - first team where user is a member)
  const userTeam = mockTeams.find((t) =>
    t.members.some((m) => m.id === user?.id)
  );

  const addTeamMember = () => {
    if (teamMembers.length < hackathon.teamSize.max) {
      setTeamMembers([...teamMembers, { name: "", email: "", role: "" }]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (index > 0) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const useExistingTeam = teamOption === "existing" && userTeam;
    const effectiveTeamName = useExistingTeam ? userTeam.name : teamName;
    const effectiveMembers = useExistingTeam
      ? userTeam.members.map((m) => ({
          name: m.name,
          email: m.email,
          role: m.role,
        }))
      : teamMembers;

    if (
      hackathon.participationType === "team" &&
      effectiveMembers.length < hackathon.teamSize.min
    ) {
      toast({
        title: "Not enough team members",
        description: `Minimum ${hackathon.teamSize.min} team members required.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await registrationService.register({
        hackathonId: hackathon.id,
        userId: user.id,
        teamName:
          hackathon.participationType === "team"
            ? effectiveTeamName
            : undefined,
        teamMembers: effectiveMembers,
        contactEmail,
        contactPhone,
      });

      toast({
        title: "Registration Successful!",
        description: "Your registration has been submitted for review.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Register for {hackathon.name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to register for this hackathon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Selection for Team Events */}
          {hackathon.participationType === "team" && (
            <div className="space-y-4">
              <Label>Team Selection</Label>
              <RadioGroup
                value={teamOption}
                onValueChange={(v) =>
                  setTeamOption(v as "existing" | "temporary")
                }
              >
                {userTeam && (
                  <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
                    <RadioGroupItem
                      value="existing"
                      id="existing"
                      className="mt-1"
                    />
                    <Label htmlFor="existing" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">Use Current Team</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Register with "{userTeam.name}" (
                        {userTeam.members.length} members)
                      </p>
                      {teamOption === "existing" && (
                        <div className="mt-3 flex -space-x-2">
                          {userTeam.members.slice(0, 5).map((m) => (
                            <Avatar
                              key={m.id}
                              className="h-8 w-8 border-2 border-background"
                            >
                              <AvatarImage src={m.avatar} />
                              <AvatarFallback>
                                {m.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      )}
                    </Label>
                  </div>
                )}
                <div className="flex items-start space-x-3 rounded-lg border border-border p-4">
                  <RadioGroupItem
                    value="temporary"
                    id="temporary"
                    className="mt-1"
                  />
                  <Label htmlFor="temporary" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-primary" />
                      <span className="font-medium">Create Temporary Team</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create a one-time team for this hackathon only
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Temporary Team Fields */}
          {(hackathon.participationType !== "team" ||
            teamOption === "temporary") &&
            hackathon.participationType === "team" && (
              <div className="space-y-2">
                <Label htmlFor="teamName">Temporary Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  required
                />
              </div>
            )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1-555-0123"
                required
              />
            </div>
          </div>

          {/* Team Members for Temporary Team */}
          {teamOption === "temporary" &&
            hackathon.participationType === "team" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Team Members</Label>
                  {teamMembers.length < hackathon.teamSize.max && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTeamMember}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Member
                    </Button>
                  )}
                </div>

                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="space-y-2 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {index === 0 ? "Team Lead" : `Member ${index + 1}`}
                      </span>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Input
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMember(index, "name", e.target.value)
                        }
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={member.email}
                        onChange={(e) =>
                          updateTeamMember(index, "email", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="Role (e.g., Frontend Developer)"
                        value={member.role}
                        onChange={(e) =>
                          updateTeamMember(index, "role", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
