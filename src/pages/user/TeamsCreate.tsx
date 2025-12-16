import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { teamService } from "@/services/teams/team.service";

export default function CreateTeam() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Validation error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const team = await teamService.createTeam(name.trim());

      toast({
        title: "Team created",
        description: "Your team has been created successfully",
      });

      navigate(`/teams/${team.id}`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Create Team</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
