/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Trash2,
  Check,
  X,
  FolderOpen,
  Trophy,
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
import { hackathonService } from "@/services/hackathon/hackathon.service";
import { registrationService } from "@/services/registration/registration.service";
import { submissionService } from "@/services/submission/submission.service";
import { winnersService, Winner } from "@/services/winners/winners.service";

import type { Hackathon, Registration } from "@/types";
import type { RegistrationAnalytics } from "@/services/registration/registration.service";


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

/* ======================================================
   MAIN PAGE
====================================================== */
export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [analytics, setAnalytics] =
    useState<RegistrationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isFinalizingWinners, setIsFinalizingWinners] = useState(false);

  const loadData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      const hack = await hackathonService.getById(id);
      const regs = await registrationService.getByHackathon(id);
      const stats = await registrationService.getAnalytics(id);

      setHackathon(hack);
      setRegistrations(regs as any);
      setAnalytics(stats);

      // Load winners if available
      try {
        const winnersData = await winnersService.list(id);
        setWinners(winnersData);
      } catch (err) {
        // No winners yet or error loading, which is fine
        console.log("No winners to load yet");
      }
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

  useEffect(() => {
    if (id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getStatusColor = (status: Registration["status"]) =>
    status === "approved"
      ? "bg-primary text-primary-foreground"
      : status === "rejected"
      ? "bg-destructive text-destructive-foreground"
      : "bg-secondary text-secondary-foreground";

  const handleUpdateStatus = async (
    regId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await registrationService.updateStatus(regId, status);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status } : r))
      );
      if (id) setAnalytics(await registrationService.getAnalytics(id));
      toast({ title: `Registration ${status}` });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update registration.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (regId: string) => {
    try {
      // TODO: Implement delete if registration service supports it
      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
      toast({ title: "Registration deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete registration.",
        variant: "destructive",
      });
    }
    setDeleteConfirmId(null);
  };

  const handleExport = () => {
    const headers = ["Entry Type", "Team Name", "Status", "Members"];

    const rows = registrations.map((r) => [
      r.team ? "Team" : "Individual",
      r.team?.name ?? "-",
      r.status,
      r.team
        ? r.team.members
            .map((m) => `${m.name} (${m.role})`)
            .join("; ")
        : `User ${r.user_id}`,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((x) => `"${x}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${hackathon?.eventName}-registrations.csv`;
    a.click();
  };

  const handleFinalizeWinners = async () => {
    if (!id) return;
    
    setIsFinalizingWinners(true);
    try {
      await winnersService.finalize(id);
      // Reload winners after finalization
      const winnersData = await winnersService.list(id);
      setWinners(winnersData);
      toast({
        title: "Success",
        description: "Winners have been finalized!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to finalize winners. Please try again.",
        variant: "destructive",
      });
      console.error("Finalize winners error:", error);
    } finally {
      setIsFinalizingWinners(false);
    }
  };

  if (isLoading) return <AdminLayout>Loading…</AdminLayout>;
  if (!hackathon) return <AdminLayout>No event found.</AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/analytics")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">{hackathon.eventName}</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() =>  navigate(`/admin/${id}/submission`)}>
              <FolderOpen className="mr-2 h-4 w-4" /> Submissions
            </Button>
            <Button 
              variant="outline" 
              onClick={handleFinalizeWinners}
              disabled={isFinalizingWinners || winners.length > 0}
            >
              <Trophy className="mr-2 h-4 w-4" /> 
              {winners.length > 0 ? "Winners Finalized" : "Finalize Winners"}
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

         {/* EVENT OVERVIEW */}
          <EventOverviewCard hackathon={hackathon} />

        {/* WINNERS DISPLAY */}
        {winners.length > 0 && (
          <Card className="border-2 border-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Winners Finalized
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {winners.map((winner) => {
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={winner.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-yellow-50 to-transparent"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{medals[winner.position - 1]}</span>
                      <div>
                        <p className="font-semibold">{winner.team.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {winner.project.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{winner.score.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Average Score</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <Stat title="Total Registrations" value={analytics?.total_registrations} />
          <Stat title="Approved" value={analytics?.approved} />
          <Stat title="Pending" value={analytics?.pending} />
          <Stat title="Participants" value={analytics?.total_participants} />
        </div>

        {/* REGISTRATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Registrations</CardTitle>
            <CardDescription>Approve or reject entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {registrations.map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {r.team?.name ?? `Individual (${r.user_id})`}
                      <Badge className={getStatusColor(r.status)}>
                        {r.status}
                      </Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Registered: {new Date(r.registered_at).toDateString()}
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

                {r.team && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {r.team.members.map((m) => (
                      <div key={m.user_id} className="bg-muted p-2 rounded-md">
                        <p className="font-medium"> {m.name}</p>
                        <p className="text-xs text-primary">{m.role}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

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
                onClick={() =>
                  deleteConfirmId && handleDelete(deleteConfirmId)
                }
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

/* Small stat card */
const Stat = ({ title, value }: any) => (
  <Card>
    <CardContent className="pt-6 text-center">
      <h2 className="text-2xl font-bold">{value ?? 0}</h2>
      <p>{title}</p>
    </CardContent>
  </Card>
);
