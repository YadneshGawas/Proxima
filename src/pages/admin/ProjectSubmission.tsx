import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  submissionService,
  ProjectSubmission,
} from "@/services/submission/submission.service";

export default function ProjectSubmissionPage() {
  const { id: hackathonId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hackathonId) {
      console.warn("No hackathonId provided");
      setLoading(false);
      return;
    }

    console.log("[ProjectSubmissionPage] Loading submissions for hackathon:", hackathonId);

    submissionService
      .listByHackathon(hackathonId)
      .then((data) => {
        console.log("[ProjectSubmissionPage] Submissions loaded:", data);
        setSubmissions(data);
        setError(null);
      })
      .catch((err) => {
        console.error("[ProjectSubmissionPage] Failed to load submissions:", err);
        setError(`Failed to load submissions: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [hackathonId]);

  if (loading) {
    return <AdminLayout>Loading submissions…</AdminLayout>;
  }

  if (error) {
    return (
      <AdminLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-800">{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Project Submissions</h1>

        {submissions.length === 0 ? (
          <p className="text-muted-foreground">
            No submissions yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {submissions.map((s) => (
              <Card key={s.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{s.team.name}</CardTitle>
                    {s.average_score !== undefined && s.average_score !== null && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="text-lg font-semibold">{s.average_score}/100</p>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{s.project_title}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.project_desc}
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/${hackathonId}/submission/${s.id}`
                      )
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
