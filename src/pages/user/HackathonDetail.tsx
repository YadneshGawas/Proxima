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
import { hackathonService } from "@/services/api";
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
  const [btnState, setBtnState] = useState(2);

  const RegState = {
    NOT_REGISTERED: 0,
    PENDING: 1,
    REJECTED: 2,
    REGISTERED: 3,
    VIEW_WINNERS: 4,
  };

  useEffect(() => {
    if (id) {
      loadHackathon();
    }
  }, [id]);

  const loadHackathon = async () => {
    if (!id) return;
    try {
      const data = await hackathonService.getById(id);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update interest status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
                alt={hackathon.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="mt-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      hackathon.status === "upcoming" ? "default" : "secondary"
                    }
                  >
                    {hackathon.status}
                  </Badge>
                  <Badge variant="outline">{hackathon.mode}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  {hackathon.name}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Organized by {hackathon.organizer}
                </p>
              </div>
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
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {hackathon.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{hackathon.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {hackathon.requirements && hackathon.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-foreground">
                    {hackathon.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Prizes */}
            {hackathon.prizes && hackathon.prizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Prizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {hackathon.prizes.map((prize, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-foreground"
                      >
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {index === 0
                            ? "1st"
                            : index === 1
                            ? "2nd"
                            : `${index + 1}th`}
                        </Badge>
                        {prize}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event Dates</p>
                    <p className="font-medium text-foreground">
                      {formatDate(hackathon.startDate)} -{" "}
                      {formatDate(hackathon.endDate)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Registration Deadline
                    </p>
                    <p className="font-medium text-foreground">
                      {formatDate(hackathon.deadline)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {hackathon.location}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Participation
                    </p>
                    <p className="font-medium text-foreground capitalize">
                      {hackathon.participationType}
                      {hackathon.participationType === "team" &&
                        ` (${hackathon.teamSize.min}-${hackathon.teamSize.max} members)`}
                    </p>
                  </div>
                </div>
                {hackathon.entryFee && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Entry Fee
                        </p>
                        <p className="font-medium text-foreground">
                          ${hackathon.entryFee}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Registration Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {hackathon.registeredCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Registered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {hackathon.interestedCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Interested</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Register Button */}
            {/* New logic must be implemented that shows whether yet to register, pending from organizer and rejected */}
            {/* After hackathon is over the button must show view winners */}
            {btnState === 4 && (
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={() => navigate(`/hackathons/${hackathon.id}/winners`)}
              >
                View Winners
              </Button>
            )}

            {btnState === 0 && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => setIsRegistrationOpen(true)}
              >
                Register Now
              </Button>
            )}

            {btnState === 1 && (
              <Button className="w-full" size="lg" disabled variant="secondary">
                Pending Approval
              </Button>
            )}

            {btnState === 2 && (
              <Button
                className="w-full"
                size="lg"
                variant="destructive"
                disabled
              >
                Registration Rejected
              </Button>
            )}

            {btnState === 3 && (
              <Button className="w-full" size="lg" disabled variant="default">
                Registered
              </Button>
            )}
          </div>
        </div>
      </div>

      <RegistrationModal
        hackathon={hackathon}
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
      />
    </DashboardLayout>
  );
}
