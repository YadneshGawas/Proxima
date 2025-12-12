import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Copy,
  Share2,
  UserPlus,
  LogOut,
  Check,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import { mockTeams, mockUsers } from "@/data/mockData";
import { InviteTeamModal } from "@/components/InviteTeamModal";

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use mockTeams (your actual team data)
  const team = mockTeams.find((t) => t.id === id);

  if (!team) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Team Not Found</h2>
          <p className="text-muted-foreground">
            The team you're looking for doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => navigate("/teams")}>
            Back to Teams
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Check user membership / owner
  const isMember = team.members?.some((m) => m.userId === user?.id);
  const isOwner = team.ownerId === user?.id;

  // Helper to get user data from mockUsers
  const getUser = (userId: string) => mockUsers.find((u) => u.id === userId);

  const copyTeamCode = async () => {
    await navigator.clipboard.writeText(team.teamCode);
    setCopied(true);
    toast({ title: "Copied!", description: "Team code copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinTeam = () => {
    toast({
      title: "Joined Team!",
      description: `You are now a member of ${team.name}. (mock only)`,
    });
  };

  const handleLeaveTeam = () => {
    toast({
      title: "Left Team",
      description: `You have left ${team.name}. (mock only)`,
    });
    navigate("/teams");
  };

  const shareInviteLink = async () => {
    const inviteLink = `${window.location.origin}/teams/join?code=${team.teamCode}`;
    await navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Invite Link Copied!",
      description: "Share this link to invite members.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/teams")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teams
        </Button>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {team.name}
              </h1>
              <Badge variant={team.isPublic ? "secondary" : "outline"}>
                {team.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            {team.description && (
              <p className="mt-2 text-muted-foreground">{team.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {isMember ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setInviteModalOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>

                {!isOwner && (
                  <Button variant="destructive" onClick={handleLeaveTeam}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Leave Team
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={handleJoinTeam}>
                <Users className="mr-2 h-4 w-4" />
                Join Team
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Team Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>Team Info</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Team Code */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Team Code</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{team.teamCode}</Badge>
                  <Button variant="ghost" size="icon" onClick={copyTeamCode}>
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Owner */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium text-foreground">
                  {getUser(team.ownerId)?.name ?? "Unknown"}
                </span>
              </div>

              <Separator />

              {/* Member Count */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium text-foreground">
                  {team.members?.length ?? 0}
                </span>
              </div>

              <Separator />

              {/* Created At */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-foreground">
                  {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Share Invite */}
              {isMember && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={shareInviteLink}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Invite Link
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Team Members Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                {team.members.length} member
                {team.members.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {team.members.map((member) => {
                  const u = getUser(member.userId); // find user for each member
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={u?.avatar} />
                          <AvatarFallback>
                            {u?.name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {u?.name ?? "Unknown User"}
                            </p>

                            {member.userId === team.ownerId && (
                              <Badge variant="default" className="text-xs">
                                Owner
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm font-medium">#{u?.code}</p>
                          <p className="text-sm text-muted-foreground">
                            {u?.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {member.role}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Joined{" "}
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <InviteTeamModal
          team={team}
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
        />
      </div>
    </DashboardLayout>
  );
}
