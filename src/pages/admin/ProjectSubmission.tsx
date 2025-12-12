import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockRegistrations, mockSubmissions } from "@/data/mockData";

export default function SubmissionListPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get submissions for this hackathon
  const submissions = mockSubmissions.filter(s => s.hackathonId === id);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Projects</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {submissions.length === 0 && (
            <p className="text-muted-foreground">No submissions yet.</p>
          )}

          {submissions.map(sub => {
            const team = mockRegistrations.find(r => r.id === sub.teamId);

            return (
              <div
                key={sub.id}
                className="rounded-lg border border-border p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">{team?.teamName}</h2>
                  <p className="text-muted-foreground">{sub.projectTitle}</p>

                  <div className="mt-2">
                    <Badge>Score: {sub.score || "Not Scored"}</Badge>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/admin/${id}/submission/${sub.teamId}`)
                  }
                >
                  Review Submission
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
