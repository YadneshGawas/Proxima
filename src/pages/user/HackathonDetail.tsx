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
import { Hackathon, Registration } from "@/types";
import { hackathonService, registrationService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function HackathonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [btnState, setBtnState] = useState<number>(4);

  // Registration button states
  const RegState = {
    NOT_REGISTERED: 0,
    PENDING: 1,
    REJECTED: 2,
    REGISTERED: 3,
    VIEW_WINNERS: 4,
  } as const;

  // -------------------------
  // Load hackathon on mount
  // -------------------------
  useEffect(() => {
    if (id) loadHackathon();
  }, [id]);

  const loadHackathon = async () => {
    setIsLoading(true);
    try {
      const data = await hackathonService.getById(id!);
      setHackathon(data);
    } catch (error) {
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

  // Trigger registration state computation
  useEffect(() => {
    if (hackathon && user) computeRegistrationState();
    else if (hackathon && !user)
      setBtnState(
        isHackathonOver(hackathon)
          ? RegState.VIEW_WINNERS
          : RegState.NOT_REGISTERED
      );
  }, [hackathon, user]);

  // -------------------------
  // Registration State Logic
  // -------------------------
  const computeRegistrationState = async () => {
    if (!hackathon || !user) return;

    if (isHackathonOver(hackathon)) {
      setBtnState(RegState.VIEW_WINNERS);
      return;
    }

    try {
      const regs = await registrationService.getByUser(user.id);
      const reg = regs.find(
        (r: Registration) => r.hackathonId === hackathon.id
      );

      if (!reg) {
        setBtnState(RegState.NOT_REGISTERED);
        return;
      }

      if (reg.status === 0) setBtnState(RegState.PENDING);
      else if (reg.status === 1) setBtnState(RegState.REGISTERED);
      else if (reg.status === 2) setBtnState(RegState.REJECTED);
    } catch {
      setBtnState(RegState.NOT_REGISTERED);
    }
  };

  const isHackathonOver = (h: Hackathon) => {
    if (!h.endDate) return false;
    return Date.now() > new Date(h.endDate).getTime();
  };

  // -------------------------
  // Interest Marking
  // -------------------------
  const handleMarkInterested = async () => {
    if (!hackathon || !user) return;

    try {
      await hackathonService.markInterested(hackathon.id, user.id);
      setIsInterested(!isInterested);

      toast({
        title: isInterested
          ? "Removed from interested"
          : "Marked as interested",
        description: isInterested
          ? "You will no longer receive updates."
          : "You will receive updates about this hackathon.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update interest status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // -------------------------
  // LOADING UI
  // -------------------------
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

  // -------------------------
  // NULL UI
  // -------------------------
  if (!hackathon) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <p className="text-muted-foreground">Hackathon not found.</p>
          <Button variant="link" onClick={() => navigate("/hackathons")}>
            Back to Hackathons
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // -------------------------
  // MAIN UI
  // -------------------------
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/hackathons")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hackathons
        </Button>

        {/* Header */}
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
                {hackathon.status && (
                  <Badge
                    variant={
                      hackathon.status === "upcoming" ? "default" : "secondary"
                    }
                  >
                    {hackathon.status}
                  </Badge>
                )}
                <Badge variant="outline">{hackathon.mode}</Badge>
              </div>

              <h1 className="text-3xl font-bold">{hackathon.eventName}</h1>

              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Organizer ID: {hackathon.organizerId}
              </p>
            </div>

            {/* Interest + Share */}
            <div className="flex gap-2">
              <Button
                variant={isInterested ? "secondary" : "outline"}
                onClick={handleMarkInterested}
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

        {/* Tags */}
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
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{hackathon.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {hackathon.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {hackathon.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Prizes */}
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

          {/* SIDEBAR */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dates */}
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event Dates</p>
                    <p className="font-medium">
                      {formatDate(hackathon.startDate)} —{" "}
                      {formatDate(hackathon.endDate)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Deadline */}
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

                {/* Location */}
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {hackathon.location ?? "Online"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Participation */}
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Participation
                    </p>
                    <p className="font-medium capitalize">
                      {hackathon.participationType}
                      {hackathon.participationType === "team" &&
                        ` (${hackathon.minTeamSize ?? "?"}-${
                          hackathon.maxTeamSize ?? "?"
                        })`}
                    </p>
                  </div>
                </div>

                {/* Entry Fee */}
                {hackathon.entryFee > 0 && (
                  <>
                    <Separator />
                    <div className="flex gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Entry Fee
                        </p>
                        <p className="font-medium">${hackathon.entryFee}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6 grid grid-cols-2 text-center gap-4">
                <div>
                  <p className="text-2xl font-bold">
                    {hackathon.registeredCount ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Registered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {hackathon.interestedCount ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Interested</p>
                </div>
              </CardContent>
            </Card>

            {/* BUTTON STATES */}
            {btnState === RegState.VIEW_WINNERS && (
              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={() =>
                  navigate(`/hackathons/${hackathon.id}/HackathonWinners`)
                }
              >
                View Winners
              </Button>
            )}

            {btnState === RegState.NOT_REGISTERED && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Login Required",
                      description: "Please log in to register",
                    });
                    return;
                  }
                  setIsRegistrationOpen(true);
                }}
              >
                Register Now
              </Button>
            )}

            {btnState === RegState.PENDING && (
              <Button className="w-full" size="lg" disabled variant="secondary">
                Pending Approval
              </Button>
            )}

            {btnState === RegState.REJECTED && (
              <Button
                className="w-full"
                size="lg"
                variant="destructive"
                disabled
              >
                Registration Rejected
              </Button>
            )}

            {btnState === RegState.REGISTERED && (
              <Button className="w-full" size="lg" disabled variant="default">
                Registered
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        hackathon={hackathon}
      />
    </DashboardLayout>
  );
}
