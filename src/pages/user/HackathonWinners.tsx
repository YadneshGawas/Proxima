import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

import { mockWinners, mockHackathonTeams } from "@/data/mockData";

export default function WinnersPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Filter winners belonging to this hackathon
  const winners = mockWinners.filter((w) => w.hackathonId === id);

  const rankLabel = (pos: number) =>
    pos === 1 ? "🥇 Rank 1" : pos === 2 ? "🥈 Rank 2" : "🥉 Rank 3";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Winners</h1>
        <p className="text-muted-foreground">
          Official results & submitted projects.
        </p>

        <div className="space-y-5">
          {winners.map((winner) => {
            const team = mockHackathonTeams.find(
              (t) => t.id === winner.hackathonTeamId
            );

            return (
              <Card key={winner.id}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      {team && (
                        <h2 className="text-xl font-semibold">{team.name}</h2>
                      )}

                      <p className="text-muted-foreground">
                        {winner.projectTitle}
                      </p>
                    </div>

                    <Badge className="px-3 py-1 text-base">
                      {rankLabel(winner.position)}
                    </Badge>
                  </div>

                  <p className="text-sm">{winner.projectDesc}</p>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => window.open(winner.gitUrl, "_blank")}
                    >
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </Button>
                    <Button
                      onClick={() => window.open(winner.liveUrl, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
