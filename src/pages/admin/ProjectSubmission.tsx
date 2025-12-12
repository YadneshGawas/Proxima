import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  mockRegistrations,
  mockSubmissions,
  mockTeams,
  mockHackathonTeams,
  mockUsers,
} from "@/data/mockData";

export default function SubmissionListPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // All submissions for this hackathon
  const submissions = mockSubmissions.filter((s) => s.hackathonId === id);

  // Helper: Resolve Team Name
  const resolveTeamName = (registrationId: string) => {
    const reg = mockRegistrations.find((r) => r.id === registrationId);
    if (!reg) return "Unknown Team";

    if (reg.globalTeamId) {
      return mockTeams.find((t) => t.id === reg.globalTeamId)?.name || "Team";
    }

    if (reg.hackathonTeamId) {
      return (
        mockHackathonTeams.find((ht) => ht.id === reg.hackathonTeamId)?.name ||
        "Hackathon Team"
      );
    }

    if (reg.userId) {
      return mockUsers.find((u) => u.id === reg.userId)?.name || "Individual";
    }

    return "Unknown";
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Projects</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {submissions.length === 0 && (
            <p className="text-muted-foreground">No submissions yet.</p>
          )}

          {submissions.map((sub) => {
            const teamName = resolveTeamName(sub.registrationId);

            return (
              <div
                key={sub.id}
                className="rounded-lg border border-border p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">{teamName}</h2>
                  <p className="text-muted-foreground">{sub.projectTitle}</p>

                  <div className="mt-2">
                    <Badge>Score: {sub.score ?? "Not Scored"}</Badge>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/${id}/submission/${sub.id}`)}
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
