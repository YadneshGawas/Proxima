import { Calendar, MapPin, Users, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hackathon } from "@/types";
import { useNavigate } from "react-router-dom";

interface HackathonCardProps {
  hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const navigate = useNavigate();

  // ❌ OLD (unsafe – crashes if date is null)
  // const formatDate = (date: string) => {
  //   return new Date(date).toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   });
  // };

  // ✅ NEW (safe for optional dates)
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tags = hackathon.tags ?? [];

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg"
      onClick={() => navigate(`/hackathons/${hackathon.id}`)}
    >
      <CardHeader className="p-0">
        {/* ❌ OLD (card header disappears if image missing)
        {hackathon.imageUrl && (
          <div className="relative h-40 overflow-hidden rounded-t-lg">
            ...
          </div>
        )}
        */}

        {/* ✅ NEW (always renders header, graceful fallback) */}
        <div className="relative h-40 overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
          
            <img
              src={hackathon.imageUrl}
              alt={hackathon.eventName}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          <div className="absolute top-2 right-2">
            <Badge
              variant={
                hackathon.status === "upcoming"
                  ? "default"
                  : hackathon.status === "ongoing"
                  ? "secondary"
                  : "outline"
              }
            >
              {hackathon.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-1">
          {hackathon.eventName}
        </h3>

        <div className="mb-3 flex flex-wrap gap-1">
          {tags.length > 0 && (
            <>
              {tags.slice(0, 1).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}

              {tags.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 1}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Posted: {formatDate(hackathon.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Deadline: {formatDate(hackathon.deadline)}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{hackathon.location || "Online"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="capitalize">{hackathon.participationType}</span>
            {hackathon.participationType === "team" && (
              <span>
                ({hackathon.minTeamSize}-{hackathon.maxTeamSize} members)
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border p-4">
        <div className="flex w-full items-center justify-between text-sm">
          {/* ❌ OLD (field does not exist in backend)
          <span className="text-muted-foreground">
            {hackathon.registeredCount} registered
          </span>
          */}

          {/* ✅ NEW (real backend field) */}
          <span className="text-muted-foreground">
            {hackathon.interestedCount} interested
          </span>

          <Button size="sm">View Details</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
