import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

import { mockWinners, mockSubmissions, mockRegistrations } from "@/data/mockData";

export default function WinnersPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const winners = mockWinners.filter(w => {
    const submission = mockSubmissions.find(s => s.id === w.projectId);
    return submission?.hackathonId === id;
  });

  const rankLabel = (pos: number) =>
    pos === 1 ? "🥇 Rank 1" :
    pos === 2 ? "🥈 Rank 2" : "🥉 Rank 3";

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Winners</h1>
        <p className="text-muted-foreground">Official results & submitted projects.</p>

        <div className="space-y-5">
          {winners.map((winner) => {
            const submission = mockSubmissions.find(s => s.id === winner.projectId);
            const team = mockRegistrations.find(r => r.id === submission.teamId);

            return (
              <Card key={winner.id}>
                <CardContent className="p-5 space-y-4">

                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">{team.teamName}</h2>
                      <p className="text-muted-foreground">{submission.projectTitle}</p>
                    </div>

                    <Badge className="px-3 py-1 text-base">
                      {rankLabel(winner.position)}
                    </Badge>
                  </div>

                  <p className="text-sm">{submission.projectDesc}</p>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => window.open(submission.githubUrl)}>
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </Button>
                    <Button onClick={() => window.open(submission.liveUrl)}>
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
