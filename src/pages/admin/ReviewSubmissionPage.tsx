import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Github, ExternalLink, Trophy } from "lucide-react";

import { mockRegistrations, mockSubmissions, mockWinners } from "@/data/mockData";

export default function ReviewSubmissionPage() {
  const { id, teamId } = useParams();
  const navigate = useNavigate();

  const team = mockRegistrations.find(t => t.id === teamId);
  const submission = mockSubmissions.find(s => s.teamId === teamId);

  const [score, setScore] = useState(submission?.score || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [position, setPosition] = useState(() => {
    const w = mockWinners.find(w => w.projectId === submission?.id);
    return w?.position || 0;
  });

  // Sync with mock data (simulate real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      const latest = mockSubmissions.find(s => s.teamId === teamId);
      if (latest && latest.score !== score) {
        setScore(latest.score);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [score, teamId]);

  const saveScore = () => {
    if (!submission) return;

    setIsSaving(true);
    setTimeout(() => {
      submission.score = Number(score);
      setIsSaving(false);
      alert("Score updated (mock).");
    }, 500);
  };

  const assignWinner = (p) => {
    if (!submission) return;

    // remove existing winner entry for this project
    const existingIndex = mockWinners.findIndex(w => w.projectId === submission.id);
    if (existingIndex !== -1) {
      mockWinners.splice(existingIndex, 1);
    }

    // add new entry
    mockWinners.push({
      id: crypto.randomUUID(),
      projectId: submission.id,
      position: p,
    });

    setPosition(p);

    alert(`Winner position set → Rank ${p}`);
  };

  if (!team || !submission) {
    return (
      <AdminLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p className="mt-4 text-muted-foreground">Team or submission not found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold">Review Submission</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{team.teamName}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Project Details */}
            <div>
              <h2 className="text-xl font-semibold">{submission.projectTitle}</h2>
              <p className="text-muted-foreground">{submission.projectDesc}</p>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => window.open(submission.githubUrl)}>
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>

              <Button onClick={() => window.open(submission.liveUrl)}>
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </Button>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="font-medium mb-2">Team Members</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                {team.teamMembers.map((m) => (
                  <li key={m.email}>
                    {m.name} — {m.role}
                  </li>
                ))}
              </ul>
            </div>

            {/* Score Input */}
            <div className="space-y-2">
              <label className="font-medium">Judge Score (0–100)</label>
              <Input
                type="number"
                min={0}
                max={100}
                className="w-32"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              />
              <Button onClick={saveScore} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Score"}
              </Button>
            </div>

            {/* Winner Assignment */}
            {/* <div className="space-y-2">
              <h3 className="font-medium mb-1">Assign Winner</h3>

              <select
                className="border rounded p-2 bg-background"
                value={position}
                onChange={(e) => assignWinner(Number(e.target.value))}
              >
                <option value={0}>No Rank</option>
                <option value={1}>🥇 Rank 1</option>
                <option value={2}>🥈 Rank 2</option>
                <option value={3}>🥉 Rank 3</option>
              </select>
            </div> */}

            {/* Edit Submission Page */}
            {/* <Button
              variant="outline"
              onClick={() =>
                navigate(`/admin/${id}/submission/${teamId}/edit`)
              }
            >
              Edit Submission
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
