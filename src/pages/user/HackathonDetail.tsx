/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Trophy,
  ArrowLeft,
  Heart,
  Share2,
  Building2,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RegistrationModal } from "@/components/RegistrationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SubmitProjectModal } from "@/components/SubmitProjectModal";

import { Hackathon, Registration } from "@/types";
import { hackathonService } from "@/services/hackathon/hackathon.service";
import { registrationService } from "@/services/registration/registration.service";
import {
  submissionService,
  ProjectSubmission,
} from "@/services/submission/submission.service";
import { ViewWinnersModal } from "@/components/ViewWinnersModal";


export default function HackathonDetail() {
  /* ========================
     ROUTING & CONTEXT
  ======================== */
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  /* ========================
     STATE
  ======================== */
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [myRegistration, setMyRegistration] =
    useState<Registration | null>(null);
  const [isSubmitProjectOpen, setIsSubmitProjectOpen] = useState(false);
  const [mySubmission, setMySubmission] =
    useState<ProjectSubmission | null>(null);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);
  const [isViewWinnersOpen, setIsViewWinnersOpen] = useState(false);

  /* ========================
     DERIVED FLAGS
  ======================== */
  const isRegistered = Boolean(myRegistration);
  const isApproved = myRegistration?.status === "approved";
  const isRejected = myRegistration?.status === "rejected";

  /* ========================
     LOAD DATA
  ======================== */
  useEffect(() => {
    if (!id) return;
    loadHackathon();
  }, [id]);

  const loadHackathon = async () => {
    setIsLoading(true);

    try {
      /* 1️⃣ Hackathon details */
      const hackathonData = await hackathonService.getById(id!);
      setHackathon(hackathonData);

      if (typeof hackathonData.isInterested === "boolean") {
        setIsInterested(hackathonData.isInterested);
      }

      /* 2️⃣ Registration state (single source of truth) */
      if (user) {
        const reg = await registrationService.checkRegistration(id!);

        if (reg.registered) {
          setMyRegistration({
            id: reg.registration_id!,
            hackathon_id: id!,
            team_id: reg.team_id ?? undefined,
            status: reg.status!,
            registered_at: new Date().toISOString(),
          } as Registration);
        } else {
          setMyRegistration(null);
        }
      }
    } catch (err) {
      console.error("Hackathon load failed:", err);
      toast({
        title: "Error",
        description: "Failed to load hackathon details.",
        variant: "destructive",
      });
      navigate("/hackathons");
    } finally {
      setIsLoading(false);
    }
  };

  /* ========================
     LOAD SUBMISSION (if user is approved)
  ======================== */
  useEffect(() => {
    if (!id || !user || !isApproved) return;

    loadMySubmission();
  }, [id, isApproved]);

  const loadMySubmission = async () => {
    if (!id) return;

    setIsLoadingSubmission(true);
    try {
      // Check if user has submitted a project for this hackathon
      const submission = await submissionService.getUserSubmission(id);
      if (submission) {
        setMySubmission(submission);
      }
    } catch (err) {
      console.error("Failed to load submission:", err);
    } finally {
      setIsLoadingSubmission(false);
    }
  };

  /* ========================
     INTEREST TOGGLE
  ======================== */
  const handleMarkInterested = async () => {
    if (!hackathon || !user) return;

    try {
      const res = await hackathonService.toggleInterest(hackathon.id);
      setIsInterested(res.is_interested);
      setHackathon((prev) =>
        prev ? { ...prev, interestedCount: res.interested_count } : prev
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to update interest status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Not specified";

  /* ========================
     LOADING
  ======================== */
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

  if (!hackathon) return null;

  /* ========================
     UI
  ======================== */
  return (
     <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/hackathons")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hackathons
        </Button>

        {/* HEADER */}
        <div className="relative">
          {hackathon.imageUrl && (
            <div className="h-64 overflow-hidden rounded-lg">
              <img
                src={hackathon.imageUrl}
                alt={hackathon.eventName}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge
                  variant={
                    hackathon.status === "upcoming"
                      ? "default"
                      : "secondary"
                  }
                >
                  {hackathon.status}
                </Badge>
                <Badge variant="outline">{hackathon.mode}</Badge>
              </div>

              <h1 className="text-3xl font-bold">
                {hackathon.eventName}
              </h1>

              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Organizer ID: {hackathon.organizerId}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={isInterested ? "secondary" : "outline"}
                onClick={handleMarkInterested}
                disabled={!user}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isInterested ? "fill-current" : ""
                  }`}
                />
                {isInterested ? "Interested" : "Mark Interested"}
              </Button>

              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* TAGS */}
        {hackathon.tags && (
          <div className="flex flex-wrap gap-2">
            {hackathon.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>{hackathon.description}</CardContent>
            </Card>

            {hackathon.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {hackathon.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {hackathon.prizes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Prizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hackathon.prizes.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Badge variant={i === 0 ? "default" : "secondary"}>
                        {i === 0 ? "1st" : i === 1 ? "2nd" : `${i + 1}th`}
                      </Badge>
                      {p}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

        
          {/* RIGHT */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Event Dates
                    </p>
                    <p className="font-medium">
                      {formatDate(hackathon.startDate)} —{" "}
                      {formatDate(hackathon.endDate)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Registration Deadline
                    </p>
                    <p className="font-medium">
                      {formatDate(hackathon.deadline)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Location
                    </p>
                    <p className="font-medium">
                      {hackathon.location ?? "Online"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Participation
                    </p>
                    <p className="font-medium capitalize">
                      {hackathon.participationType}
                      {hackathon.participationType === "team" &&
                        ` (${hackathon.minTeamSize}-${hackathon.maxTeamSize})`}
                    </p>
                  </div>
                </div>

                {hackathon.entryFee > 0 && (
                  <>
                    <Separator />
                    <div className="flex gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Entry Fee
                        </p>
                        <p className="font-medium">
                          ₹{hackathon.entryFee}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold">
                  {hackathon.interestedCount ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Interested
                </p>
              </CardContent>
            </Card>

            {/* REGISTRATION STATUS */}
            {myRegistration && (
              <Badge
                className="w-full justify-center"
                variant={
                  myRegistration.status === "approved"
                    ? "default"
                    : myRegistration.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                Registered via{" "}
                {myRegistration.team_id ? "Team" : "Individual"} ·{" "}
                {myRegistration.status}
              </Badge>
            )}

            {/* ACTION */}
            {mySubmission ? (
              <Button
                size="lg"
                className="w-full"
                onClick={() =>
                  navigate(
                    `/hackathons/${hackathon.id}/submission/${mySubmission.id}`
                  )
                }
              >
                View Submitted Project
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full"
                disabled={isRejected || isLoadingSubmission || !isApproved}
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Login Required",
                      description: "Please log in to continue",
                    });
                    return;
                  }

                  if (!isRegistered) {
                    setIsRegistrationOpen(true);
                    return;
                  }

                  if (isApproved) {
                    setIsSubmitProjectOpen(true);
                    return;
                  }
                }}
              >
                {!isRegistered && "Register Now"}
                {isRegistered && !isRejected && !isApproved && "Pending Approval"}
                {isRegistered && !isRejected && isApproved && "Submit Project"}
                {isRejected && "Registration Rejected"}
              </Button>
            )}

            {/* VIEW WINNERS */}
            <Button
              size="lg"
              className="w-full"
              variant="outline"
              onClick={() => setIsViewWinnersOpen(true)}
            >
              <Trophy className="mr-2 h-4 w-4" />
              View Winners
            </Button>
          </div>
        </div>
      </div>

      <RegistrationModal
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        hackathon={hackathon}
      />

      {isApproved && myRegistration?.team_id && (
        <SubmitProjectModal
          isOpen={isSubmitProjectOpen}
          onClose={() => setIsSubmitProjectOpen(false)}
          onSuccess={(submissionId) => {
            setMySubmission({
              id: submissionId,
              hackathon_id: id!,
              project_title: "",
              project_desc: "",
              github_url: "",
              team: myRegistration.team || { id: myRegistration.team_id, name: "", created_by: 0, members: [] },
              created_at: new Date().toISOString(),
            } as any);
            toast({
              title: "Success",
              description: "Project submitted successfully!",
            });
          }}
          hackathonId={id!}
          teamId={myRegistration.team_id}
        />
      )}

      <ViewWinnersModal
        isOpen={isViewWinnersOpen}
        hackathonId={id!}
        onOpenChange={setIsViewWinnersOpen}
      />
    </DashboardLayout>
  );
}

/* ========================
   SMALL UI HELPER
======================== */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
