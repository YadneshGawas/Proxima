/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Download,
  Trash2,
  Check,
  X,
  FolderOpen,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";

import {
  Hackathon,
  Registration,
  GlobalTeamMember,
  HackathonTeamMember,
} from "@/types";
import { hackathonService } from "@/services/hackathon/hackathon.service";


import { registrationService } from "@/services/api";

function EventOverviewCard({ hackathon }: { hackathon: Hackathon }) {
  return (
    <Card>
      <CardHeader>

      </CardHeader>

      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Status</p>
          <Badge>{hackathon.status}</Badge>
        </div>

        <div>
          <p className="text-muted-foreground">Entry Fee</p>
          <p>₹ {hackathon.entryFee}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Team Size</p>
          <p>
            {hackathon.participationType === "team"
              ? `${hackathon.minTeamSize} – ${hackathon.maxTeamSize}`
              : "Individual"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Max Participants</p>
          <p>{hackathon.maxParticipants ?? "Unlimited"}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Deadline</p>
          <p>{new Date(hackathon.deadline).toDateString()}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Start Date</p>
          <p>{new Date(hackathon.startDate).toDateString()}</p>
        </div>

        <div>
          <p className="text-muted-foreground">End Date</p>
          <p>{new Date(hackathon.endDate).toDateString()}</p>
        </div>

        <div className="col-span-2 md:col-span-3">
          <p className="text-muted-foreground">Description</p>
          <p>{hackathon.description}</p>
        </div>

        {hackathon.tags?.length > 0 && (
          <div className="col-span-2 md:col-span-3">
            <p className="text-muted-foreground mb-1">Tags</p>
            <div className="flex gap-2 flex-wrap">
              {hackathon.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hackathon.requirements?.length > 0 && (
          <div className="col-span-2 md:col-span-3">
            <p className="text-muted-foreground">Requirements</p>
            <ul className="list-disc list-inside">
              {hackathon.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {hackathon.prizes?.length > 0 && (
          <div className="col-span-2 md:col-span-3">
            <p className="text-muted-foreground">Prizes</p>
            <ul className="list-disc list-inside">
              {hackathon.prizes.map((prize, idx) => (
                <li key={idx}>₹ {prize}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
  if (!id) return;

  try {
    // 1️⃣ Fetch hackathon
    const hack = await hackathonService.getById(id);
    setHackathon(hack);

    // 2️⃣ Fetch registrations for this hackathon
    const regRes = await registrationService.getByHackathon(id);

    // 3️⃣ Normalize for UI
    const formatted = regRes.map((reg: Registration) =>
      formatRegistration(reg)
    );

    setRegistrations(formatted);
  } catch {
    toast({
      title: "Error",
      description: "Failed to load event details.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  /** Convert raw Registration into UI-friendly structure */
  // const formatRegistration = (reg: Registration) => {
  //   // Individual registration
  //   if (reg.userId) {
  //     const user = mockUsers.find((u) => u.id === reg.userId);
  //     return {
  //       ...reg,
  //       type: "individual",
  //       teamName: "Individual Entry",
  //       contactEmail: user?.email || "",
  //       contactPhone: "-",
  //       teamMembers: [
  //         {
  //           name: user?.name || "Unknown",
  //           email: user?.email || "",
  //           role: "Participant",
  //         },
  //       ],
  //     };
  //   }

  //   // Global team registration
  //   if (reg.globalTeamId) {
  //     const team = mockTeams.find((t) => t.id === reg.globalTeamId);
  //     const members = (team?.members || []).map((m) => {
  //       const u = mockUsers.find((u) => u.id === m.userId);
  //       return {
  //         name: u?.name || "",
  //         email: u?.email || "",
  //         role: m.role,
  //       };
  //     });

  //     const ownerUser = mockUsers.find((u) => u.id === team?.ownerId);

  //     return {
  //       ...reg,
  //       teamName: team?.name || "Team",
  //       contactEmail: ownerUser?.email || "",
  //       contactPhone: "-",
  //       teamMembers: members,
  //     };
  //   }

  //   // Hackathon team registration
  //   if (reg.hackathonTeamId) {
  //     const ht = mockHackathonTeams.find((t) => t.id === reg.hackathonTeamId);
  //     const members = (ht?.members || []).map((m) => {
  //       const u = mockUsers.find((u) => u.id === m.userId);
  //       return {
  //         name: u?.name || "",
  //         email: u?.email || "",
  //         role: "Member",
  //       };
  //     });

  //     return {
  //       ...reg,
  //       teamName: ht?.name || "Hackathon Team",
  //       contactEmail: members[0]?.email || "",
  //       contactPhone: "-",
  //       teamMembers: members,
  //     };
  //   }

  //   return reg;
  // };

  const formatRegistration = (reg: Registration) => ({
  ...reg,
  teamName: reg.team_name ?? "Individual Entry",
  contactEmail: reg.contact_email ?? "-",
  contactPhone: reg.contact_phone ?? "-",
  teamMembers: reg.team_members ?? [],
});

  /** Approve / Reject Registration */
  const handleUpdateStatus = async (
    regId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const mapped = status === "approved" ? 1 : 2;

      await registrationService.updateStatus(regId, mapped);

      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status } : r))
      );

      toast({ title: `Registration ${status}!` });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update registration status.",
        variant: "destructive",
      });
    }
  };

  /** Delete a registration */
  const handleDelete = async (regId: string) => {
    try {
      await registrationService.delete(regId);
      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
      toast({ title: "Registration deleted!" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete registration.",
        variant: "destructive",
      });
    }
    setDeleteConfirmId(null);
  };

  /** Export CSV */
  const handleExport = () => {
    const headers = ["Team Name", "Contact Email", "Status", "Member List"];

    const rows = registrations.map((r) => [
      r.teamName,
      r.contactEmail,
      r.status,
      r.teamMembers.map((m: any) => `${m.name} (${m.email})`).join("; "),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((x) => `"${x}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${hackathon?.eventName || "event"}-participants.csv`;
    a.click();

    toast({ title: "Exported!" });
  };

  const getStatusColor = (status: string) =>
    status === "approved"
      ? "bg-primary text-primary-foreground"
      : status === "rejected"
      ? "bg-destructive text-destructive-foreground"
      : "bg-secondary text-secondary-foreground";

  if (isLoading)
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );

  if (!hackathon)
    return (
      <AdminLayout>
        <p>No event found.</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* BACK BUTTON */}
        <Button variant="ghost" onClick={() => navigate("/admin/analytics")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analytics
        </Button>

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{hackathon.eventName}</h1>
            <p className="text-muted-foreground">
              Organizer: {hackathon.organizerId} • {hackathon.location ?? "N/A"}
            </p>

            <div className="mt-2 flex gap-2">
              <Badge>{hackathon.status ?? "Unknown"}</Badge>
              <Badge variant="outline">{hackathon.mode}</Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              View Submissions
            </Button>

            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* EVENT OVERVIEW */}
          <EventOverviewCard hackathon={hackathon} />

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold">{registrations.length}</h2>
              <p>Total Registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold">
                {registrations.filter((r) => r.status === "approved").length}
              </h2>
              <p>Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold">
                {registrations.filter((r) => r.status === "pending").length}
              </h2>
              <p>Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold">
                {registrations.reduce(
                  (sum, r) => sum + r.teamMembers.length,
                  0
                )}
              </h2>
              <p>Total Participants</p>
            </CardContent>
          </Card>
        </div>

        {/* REGISTRATION LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Registrations</CardTitle>
            <CardDescription>Manage and approve teams</CardDescription>
          </CardHeader>

          <CardContent>
            {registrations.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No registrations yet.
              </p>
            ) : (
              <div className="space-y-4">
                {registrations.map((r) => (
                  <div key={r.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold flex items-center gap-2">
                          {r.teamName}
                          <Badge className={getStatusColor(r.status)}>
                            {r.status}
                          </Badge>
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {r.contactEmail}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Registered: {new Date(r.registeredAt).toDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {r.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleUpdateStatus(r.id, "approved")
                              }
                            >
                              <Check className="h-4 w-4 text-primary" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleUpdateStatus(r.id, "rejected")
                              }
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirmId(r.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* TEAM MEMBERS */}
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Members:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {r.teamMembers.map((m: any, idx: number) => (
                          <div key={idx} className="bg-muted p-2 rounded-md">
                            <p className="font-medium">{m.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.email}
                            </p>
                            <p className="text-xs text-primary">{m.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* DELETE CONFIRMATION */}
        <Dialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Registration</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
