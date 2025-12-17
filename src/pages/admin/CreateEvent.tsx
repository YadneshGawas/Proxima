/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { Hackathon } from "@/types";
import { hackathonService } from "@/services/hackathon/hackathon.service";

/* ===============================
   HELPERS
================================ */

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const fromDateInputValue = (value?: string) => {
  if (!value) return null;
  return new Date(value).toISOString();
};

const splitToArray = (value?: string) =>
  value ? value.split(",").map(v => v.trim()).filter(Boolean) : [];

/* ===============================
   FORM MODEL
================================ */

interface HackathonForm {
  eventName: string;
  description?: string;
  organizerId: string;
  location?: string;
  mode: "online" | "offline" | "hybrid";
  participationType: "individual" | "team";
  minTeamSize?: number;
  maxTeamSize?: number;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  entryFee: number;
  maxParticipants?: number;
  status?: "upcoming" | "ongoing" | "completed";
  imageUrl?: string;
  requirementsText: string;
  prizesText: string;
  tagsText: string;
}

const initialForm: HackathonForm = {
  eventName: "",
  description: "",
  organizerId: "",
  location: "",
  mode: "online",
  participationType: "team",
  minTeamSize: 1,
  maxTeamSize: 5,
  deadline: "",
  startDate: "",
  endDate: "",
  entryFee: 0,
  maxParticipants: 100,
  status: "upcoming",
  imageUrl: "",
  requirementsText: "",
  prizesText: "",
  tagsText: "",
};

/* ===============================
   PAYLOAD MAPPER
================================ */

const mapCreatePayload = (form: HackathonForm) => ({
  event_name: form.eventName,
  organizer_id: form.organizerId,
  description: form.description || null,
  location: form.location || null,
  mode: form.mode,
  participation_type: form.participationType,
  min_team_size: form.participationType === "team" ? form.minTeamSize : null,
  max_team_size: form.participationType === "team" ? form.maxTeamSize : null,
  deadline: fromDateInputValue(form.deadline),
  start_date: fromDateInputValue(form.startDate),
  end_date: fromDateInputValue(form.endDate),
  entry_fee: Number(form.entryFee) || 0,
  max_participants: form.maxParticipants ?? null,
  status: form.status ?? "upcoming",
  image_url: form.imageUrl || null,
  requirements: splitToArray(form.requirementsText),
  prizes: splitToArray(form.prizesText),
  tags: splitToArray(form.tagsText),
});

/* ===============================
   COMPONENT
================================ */

export default function CreateEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [events, setEvents] = useState<Hackathon[]>([]);
  const [form, setForm] = useState<HackathonForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setForm(prev => ({ ...prev, organizerId: user.id }));
    }
  }, [user]);

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    const res = await hackathonService.getAll({ mine: true });
    setEvents(res.results);
  };

  /* ===============================
     CREATE / UPDATE
================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const updated = await hackathonService.update(
          editingId,
          mapCreatePayload(form)
        );

        setEvents(prev =>
          prev.map(e => (e.id === editingId ? updated : e))
        );

        toast({ title: "Event updated successfully" });
      } else {
        const created = await hackathonService.create(
          mapCreatePayload(form)
        );

        setEvents(prev => [created, ...prev]);
        toast({ title: "Event created successfully" });
      }

      setForm({ ...initialForm, organizerId: user?.id ?? "" });
      setEditingId(null);
      setIsDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     EDIT
================================ */

  const handleEdit = (hack: Hackathon) => {
    setForm({
      eventName: hack.eventName,
      description: hack.description ?? "",
      organizerId: hack.organizerId,
      location: hack.location ?? "",
      mode: hack.mode,
      participationType: hack.participationType,
      minTeamSize: hack.minTeamSize ?? 1,
      maxTeamSize: hack.maxTeamSize ?? 5,
      deadline: toDateInputValue(hack.deadline),
      startDate: toDateInputValue(hack.startDate),
      endDate: toDateInputValue(hack.endDate),
      entryFee: hack.entryFee ?? 0,
      maxParticipants: hack.maxParticipants ?? 100,
      status: hack.status ?? "upcoming",
      imageUrl: hack.imageUrl ?? "",
      requirementsText: (hack.requirements ?? []).join(", "),
      prizesText: (hack.prizes ?? []).join(", "),
      tagsText: (hack.tags ?? []).join(", "),
    });

    setEditingId(hack.id);
    setIsDialogOpen(true);
  };

  /* ===============================
     DELETE
================================ */

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    setIsDeleting(true);
    try {
      await hackathonService.delete(deleteConfirmId);
      setEvents(prev => prev.filter(e => e.id !== deleteConfirmId));
      toast({ title: "Event deleted successfully" });
      setDeleteConfirmId(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /* ===============================
     RENDER
================================ */

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="text-muted-foreground">
              Create and edit hackathons.
            </p>
          </div>

          <Button
            onClick={() => {
              setForm({ ...initialForm, organizerId: user?.id ?? "" });
              setEditingId(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* EVENT LIST */}
        <div className="grid gap-4">
          {events.map(event => (
            <Card key={event.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold">{event.eventName}</h3>
                  <p className="text-sm text-muted-foreground">
                    You • {event.location} • {event.mode}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(event.tags ?? []).map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{event.status}</Badge>

                  <Button variant="ghost" size="icon"
                    onClick={() => navigate(`/admin/events/${event.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon"
                    onClick={() => handleEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon"
                    onClick={() => setDeleteConfirmId(event.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* DELETE CONFIRM */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* CREATE / EDIT FORM */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Event" : "Create Event"}
              </DialogTitle>
              <DialogDescription>
                Fill event details below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EVENT NAME */}
              <div>
                <Label>Event Name</Label>
                <Input
                  value={form.eventName}
                  onChange={e => setForm({ ...form, eventName: e.target.value })}
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              {/* IMAGE */}
              <div>
                <Label>Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              {/* LOCATION + MODE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Mode</Label>
                  <Select
                    value={form.mode}
                    onValueChange={v => setForm({ ...form, mode: v as any })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PARTICIPATION TYPE */}
              <div>
                <Label>Participation Type</Label>
                <Select
                  value={form.participationType}
                  onValueChange={v => {
                    const type = v as "individual" | "team";
                    setForm({
                      ...form,
                      participationType: type,
                      minTeamSize: type === "team" ? form.minTeamSize ?? 1 : undefined,
                      maxTeamSize: type === "team" ? form.maxTeamSize ?? 5 : undefined,
                    });
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TEAM SIZE */}
              {form.participationType === "team" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Minimum Members</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.minTeamSize}
                      onChange={e => setForm({ ...form, minTeamSize: +e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Maximum Members</Label>
                    <Input
                      type="number"
                      min={form.minTeamSize || 1}
                      value={form.maxTeamSize}
                      onChange={e => setForm({ ...form, maxTeamSize: +e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* DATES */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Deadline</Label>
                  <Input type="date" value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })} required />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>

              {/* ENTRY + MAX */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entry Fee</Label>
                  <Input type="number" min={0}
                    value={form.entryFee}
                    onChange={e => setForm({ ...form, entryFee: +e.target.value })} />
                </div>
                <div>
                  <Label>Max Participants</Label>
                  <Input type="number" min={1}
                    value={form.maxParticipants}
                    onChange={e => setForm({ ...form, maxParticipants: +e.target.value })} />
                </div>
              </div>

              {/* REQUIREMENTS / PRIZES / TAGS */}
              <Textarea
                placeholder="Requirements (comma separated)"
                value={form.requirementsText}
                onChange={e => setForm({ ...form, requirementsText: e.target.value })}
              />
              <Textarea
                placeholder="Prizes (comma separated)"
                value={form.prizesText}
                onChange={e => setForm({ ...form, prizesText: e.target.value })}
              />
              <Textarea
                placeholder="Tags (comma separated)"
                value={form.tagsText}
                onChange={e => setForm({ ...form, tagsText: e.target.value })}
              />

              <DialogFooter>
                <Button type="button" variant="outline"
                  onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update Event" : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}
