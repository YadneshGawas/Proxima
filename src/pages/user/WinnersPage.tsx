import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Medal, Trophy, Users } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { winnersService, Winner } from "@/services/winners/winners.service";

export default function WinnersPage() {
  const { hackathonId } = useParams<{ hackathonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hackathonId) return;
    loadWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

  const loadWinners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await winnersService.list(hackathonId!);
      setWinners(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load winners";
      setError(message);
      console.error("Failed to load winners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalIcon = (position: number) => {
    const medals = {
      1: { icon: "🥇", color: "text-yellow-500", label: "1st Place" },
      2: { icon: "🥈", color: "text-gray-400", label: "2nd Place" },
      3: { icon: "🥉", color: "text-orange-600", label: "3rd Place" },
    };
    return medals[position as keyof typeof medals] || { icon: "🏆", color: "text-blue-500", label: "Winner" };
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-800 font-medium">Error Loading Winners</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="mt-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Hackathon Winners</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            {winners.length === 0
              ? "No winners finalized yet"
              : `${winners.length} winner${winners.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Winners Grid */}
        {winners.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {winners.map((winner) => {
              const medal = getMedalIcon(winner.position);
              return (
                <Card
                  key={winner.id}
                  className="overflow-hidden border-2 hover:shadow-lg transition-shadow"
                >
                  {/* Medal Badge */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{medal.icon}</span>
                      <span className="font-bold text-lg">{medal.label}</span>
                    </div>
                    <Badge variant="default" className="text-sm">
                      Score: {winner.score.toFixed(2)}
                    </Badge>
                  </div>

                  <CardContent className="pt-6 space-y-4">
                    {/* Project Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {winner.project.title}
                      </h3>
                      <div className="space-y-2">
                        {winner.project.github_url && (
                          <a
                            href={winner.project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            📦 GitHub Repository
                          </a>
                        )}
                        {winner.project.live_url && (
                          <a
                            href={winner.project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            🌐 Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="font-semibold text-sm">{winner.team.name}</p>
                      </div>
                      <div className="space-y-2">
                        {winner.team.members.map((member) => (
                          <div
                            key={member.user_id}
                            className="text-sm text-muted-foreground flex justify-between items-center"
                          >
                            <span>{member.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Finalized:{" "}
                      {new Date(winner.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No winners have been finalized yet for this hackathon.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
