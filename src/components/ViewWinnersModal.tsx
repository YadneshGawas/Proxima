import { useState, useEffect } from "react";
import { Trophy, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { winnersService, Winner } from "@/services/winners/winners.service";

interface ViewWinnersModalProps {
  isOpen: boolean;
  hackathonId: string;
  onOpenChange: (open: boolean) => void;
}

export function ViewWinnersModal({
  isOpen,
  hackathonId,
  onOpenChange,
}: ViewWinnersModalProps) {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !hackathonId) return;
    loadWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hackathonId]);

  const loadWinners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await winnersService.list(hackathonId);
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
    return (
      medals[position as keyof typeof medals] || {
        icon: "🏆",
        color: "text-blue-500",
        label: "Winner",
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Hackathon Winners
          </DialogTitle>
          <DialogDescription>
            Top performers of this hackathon
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-red-800 font-medium">Error Loading Winners</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {!isLoading && !error && winners.length === 0 && (
          <div className="py-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No winners finalized yet for this hackathon.
            </p>
          </div>
        )}

        {!isLoading && !error && winners.length > 0 && (
          <div className="space-y-3">
            {winners.map((winner) => {
              const medal = getMedalIcon(winner.position);
              return (
                <div
                  key={winner.id}
                  className="p-4 rounded-lg border bg-gradient-to-r from-yellow-50/50 to-transparent hover:bg-yellow-50/80 transition-colors"
                >
                  {/* Header with medal and score */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{medal.icon}</span>
                      <div>
                        <p className="font-semibold text-lg">
                          {winner.project.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {medal.label}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {winner.score.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 mb-3">
                    {winner.project.github_url && (
                      <a
                        href={winner.project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        📦 GitHub
                      </a>
                    )}
                    {winner.project.live_url && (
                      <a
                        href={winner.project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        🌐 Live
                      </a>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <p className="font-medium">{winner.team.name}</p>
                    </div>
                    <div className="ml-5 space-y-1">
                      {winner.team.members.map((member) => (
                        <div
                          key={member.user_id}
                          className="text-muted-foreground text-xs flex justify-between"
                        >
                          <span>{member.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
