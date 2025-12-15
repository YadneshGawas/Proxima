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
import { Hackathon } from "@/types";
import { hackathonService } from "@/services/hackathon/hackathon.service";
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

  const RegState = {
    NOT_REGISTERED: 0,
  } as const;

  const [btnState] = useState<number>(RegState.NOT_REGISTERED);

  // -------------------------
  // LOAD HACKATHON
  // -------------------------
  useEffect(() => {
    if (id) loadHackathon();
  }, [id]);

  const loadHackathon = async () => {
    setIsLoading(true);
    try {
      const data = await hackathonService.getById(id!);
      setHackathon(data);

      // ✅ sync interest from backend
      if (typeof data.isInterested === "boolean") {
        setIsInterested(data.isInterested);
      }
    } catch {
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

  // -------------------------
  // INTEREST TOGGLE (FIXED)
  // -------------------------
  const handleMarkInterested = async () => {
    if (!hackathon || !user) return;

    try {
      const res = await hackathonService.toggleInterest(hackathon.id);

      // ✅ instant UI sync (NO REFRESH NEEDED)
      setIsInterested(res.is_interested);
      setHackathon((prev) =>
        prev
          ? {
              ...prev,
              interestedCount: res.interested_count,
            }
          : prev
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
          </div>
        </div>
      </div>

      <RegistrationModal
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        hackathon={hackathon}
      />
    </DashboardLayout>
  );
}
