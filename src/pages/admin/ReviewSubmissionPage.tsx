import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

import {
  mockRegistrations,
  mockSubmissions,
  mockTeams,
  mockHackathonTeams,
  mockUsers,
} from "@/data/mockData";

export default function ReviewSubmissionPage() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  // Get submission
  const submission = mockSubmissions.find((s) => s.id === submissionId) || null;

  // Get registration
  const registration = submission
    ? mockRegistrations.find((r) => r.id === submission.registrationId) || null
    : null;

  // HOOKS MUST COME BEFORE ANY CONDITIONAL RETURN
  const [score, setScore] = useState(submission?.score ?? 0);
  const [isSaving, setIsSaving] = useState(false);

  // If invalid, return AFTER hooks
  if (!submission || !registration) {
    return (
      <AdminLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p className="mt-4 text-muted-foreground">Submission not found.</p>
      </AdminLayout>
    );
  }

  // Resolve team name & members
  let teamName = "Unknown Team";
  let memberList: string[] = [];

  if (registration.globalTeamId) {
    const team = mockTeams.find((t) => t.id === registration.globalTeamId);
    teamName = team?.name ?? "Team";
    memberList =
      team?.members?.map((m) => {
        const user = mockUsers.find((u) => u.id === m.userId);
        return `${user?.name} — ${m.role}`;
      }) ?? [];
  }

  if (registration.hackathonTeamId) {
    const ht = mockHackathonTeams.find(
      (t) => t.id === registration.hackathonTeamId
    );
    teamName = ht?.name ?? "Hackathon Team";
    memberList =
      ht?.members?.map((m) => {
        const user = mockUsers.find((u) => u.id === m.userId);
        return user?.name ?? "Unknown";
      }) ?? [];
  }

  if (registration.userId) {
    const user = mockUsers.find((u) => u.id === registration.userId);
    teamName = user?.name ?? "Individual";
    memberList = [teamName];
  }

  const saveScore = () => {
    submission.score = Number(score);
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      alert("Score updated (mock).");
    }, 400);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold">Review Submission</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{teamName}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Project */}
            <div>
              <h2 className="text-xl font-semibold">
                {submission.projectTitle}
              </h2>
              <p className="text-muted-foreground">{submission.projectDesc}</p>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {submission.githubUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(submission.githubUrl)}
                >
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </Button>
              )}
              {submission.liveUrl && (
                <Button onClick={() => window.open(submission.liveUrl)}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Button>
              )}
            </div>

            {/* Members */}
            <div>
              <h3 className="font-medium mb-2">Team Members</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                {memberList.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <label className="font-medium">Judge Score (0–100)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={score}
                className="w-32"
                onChange={(e) => setScore(Number(e.target.value))}
              />
              <Button disabled={isSaving} onClick={saveScore}>
                {isSaving ? "Saving..." : "Save Score"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
