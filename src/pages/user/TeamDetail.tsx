/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Trash2,
  UserPlus,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import { HackathonTeam } from "@/types";
import { teamService } from "@/services/teams/team.service";

interface SimpleUser {
  id: number;
  name: string;
}

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [team, setTeam] = useState<HackathonTeam | null>(null);
  const [loading, setLoading] = useState(true);

  // add member state
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    if (id) {
      loadTeam();
      loadUsers();
    }
  }, [id]);

  const loadTeam = async () => {
    try {
      const data = await teamService.getTeamById(id!);
      setTeam(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load team.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await teamService.getAllUsers();
      setUsers(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  if (!team) {
    return (
      <DashboardLayout>
        <p>Team not found.</p>
      </DashboardLayout>
    );
  }

  const isOwner = Number(user?.id) === team.createdBy;

  const handleRemoveMember = async (memberId: number) => {
    try {
      await teamService.removeMember(team.id, memberId);
      toast({ title: "Member removed" });
      loadTeam();
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;

    try {
      await teamService.addMember(team.id, Number(selectedUser), "member");
      toast({ title: "Member added" });
      setSelectedUser("");
      loadTeam();
    } catch {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* BACK */}
        <Button variant="ghost" onClick={() => navigate("/teams")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">
            {team.membersCount} members
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* TEAM INFO */}
          <Card>
            <CardHeader>
              <CardTitle>Team Info</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium">
                  {team.members.find(m => m.role === "owner")?.name ?? "Unknown"}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Members</span>
                <span>{team.membersCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* MEMBERS */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members
              </CardTitle>
              <CardDescription>Team roster</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* ADD MEMBER (OWNER ONLY) */}
              {isOwner && (
                <div className="flex gap-2">
                  <Select
                    value={selectedUser}
                    onValueChange={setSelectedUser}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter(
                          (u) =>
                            !team.members.some(
                              (m) => m.memberId === u.id
                            )
                        )
                        .map((u) => (
                          <SelectItem
                            key={u.id}
                            value={String(u.id)}
                          >
                            {u.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={handleAddMember}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              )}

              <Separator />

              {team.members.map((m) => (
                <div
                  key={m.memberId}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                     <AvatarFallback>
                        {(m.name?.[0] ?? "?").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{m.name ?? "Unknown"}</p>
                        {m.role === "owner" && <Badge>Owner</Badge>}
                      </div>

                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined{" "}
                        {new Date(m.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {isOwner && m.role !== "owner" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveMember(m.memberId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
