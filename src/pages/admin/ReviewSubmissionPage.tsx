import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  submissionService,
  ProjectSubmission,
} from "@/services/submission/submission.service";

export default function ReviewSubmissionPage() {
  const { hackathonId, submissionId } = useParams<{
    hackathonId: string;
    submissionId: string;
  }>();

  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState<ProjectSubmission | null>(null);
  const [score, setScore] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);

  useEffect(() => {
    if (!submissionId) return;

    submissionService
      .getById(submissionId)
      .then((data) => {
        setSubmission(data);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error("Failed to fetch submission:", error);
        setError(`Failed to fetch submission: ${error.message}`);
        setLoading(false);
      });
  }, [submissionId]);

  if (loading) {
    return <AdminLayout>Loading submission…</AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-800 font-medium">Error Loading Submission</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="mt-4 text-muted-foreground">
          Submission not found.
        </p>
      </AdminLayout>
    );
  }

  const saveScore = async () => {
    if (score < 0 || score > 100) {
      alert("Score must be between 0 and 100");
      return;
    }
    setSaving(true);
    try {
      await submissionService.score(submission.id, score);
      navigate(-1);
    } catch (error) {
      console.error("Failed to save score:", error);
      alert("Failed to save score. Please try again.");
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Review Submission</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {submission.team.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">
                {submission.project_title}
              </h2>
              <p className="text-muted-foreground">
                {submission.project_desc}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(submission.github_url)
                }
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>

              {submission.live_url && (
                <Button
                  onClick={() =>
                    window.open(submission.live_url)
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live
                </Button>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">
                Team Members
              </h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                {submission.team.members.map((m) => (
                  <li key={m.user_id}>
                    {m.name} — {m.role}
                  </li>
                ))}
              </ul>
            </div>

            {isFinalized ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 font-medium">
                  ✓ Winners have been finalized. Scoring is now disabled.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="font-medium">
                  Judge Score (0–100)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={score}
                  className="w-32"
                  onChange={(e) =>
                    setScore(Number(e.target.value))
                  }
                />
                <Button
                  disabled={saving}
                  onClick={saveScore}
                >
                  {saving ? "Saving…" : "Save Score"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
