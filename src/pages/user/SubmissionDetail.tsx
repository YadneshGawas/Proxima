import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, Edit2 } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import {
  submissionService,
  ProjectSubmission,
} from "@/services/submission/submission.service";
import { SubmissionEditModal } from "@/components/SubmissionEditModal";

export default function SubmissionDetail() {
  const { hackathonId, submissionId } = useParams<{
    hackathonId: string;
    submissionId: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    loadSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const loadSubmission = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await submissionService.getById(submissionId!);
      setSubmission(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load submission";
      setError(message);
      console.error("Failed to load submission:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
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
          <p className="text-red-800 font-medium">Error Loading Submission</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!submission) {
    return (
      <DashboardLayout>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="mt-4 text-muted-foreground">Submission not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{submission.project_title}</h1>
            <p className="text-muted-foreground mt-2">
              Team: {submission.team.name}
            </p>
          </div>
          <Button onClick={() => setIsEditOpen(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* DESCRIPTION */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{submission.project_desc}</p>
              </CardContent>
            </Card>

            {/* LINKS */}
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    GitHub Repository
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(submission.github_url, "_blank")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Open GitHub
                  </Button>
                </div>

                {submission.live_url && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Live Demo
                    </p>
                    <Button
                      className="w-full"
                      onClick={() =>
                        window.open(submission.live_url, "_blank")
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Live Demo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* TEAM MEMBERS */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submission.team.members.map((member) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                      <Badge variant="outline">Joined</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* METADATA */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Submitted On
                  </p>
                  <p className="font-medium">
                    {new Date(submission.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                {submission.average_score !== undefined &&
                  submission.average_score !== null && (
                    <>
                      <hr />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Average Score
                        </p>
                        <p className="text-2xl font-bold">
                          {submission.average_score}/100
                        </p>
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>

            {/* TEAM INFO */}
            <Card>
              <CardHeader>
                <CardTitle>Team Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Team Name</p>
                  <p className="font-medium">{submission.team.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Team Members
                  </p>
                  <p className="font-medium">
                    {submission.team.members.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {submission && (
        <SubmissionEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          submission={submission}
          onSuccess={() => {
            loadSubmission();
            toast({
              title: "Success",
              description: "Project updated successfully!",
            });
          }}
        />
      )}
    </DashboardLayout>
  );
}
