/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { hackathonService } from "@/services/api";
import { availableTags, mockHackathons, mockUsers } from "@/data/mockData";

// -------------------------------------------------------
// FORM MODEL (aligned with Hackathon type)
// -------------------------------------------------------
interface HackathonForm {
  eventName: string;
  description: string;
  organizerId: string;
  location: string;
  mode: "online" | "offline" | "hybrid";
  participationType: "individual" | "team";
  minTeamSize: number;
  maxTeamSize: number;
  deadline: string;
  startDate: string;
  endDate: string;
  tags: string[];
  entryFee: number;
  maxParticipants: number;
}

const initialForm: HackathonForm = {
  eventName: "",
  description: "",
  organizerId: "u2",
  location: "",
  mode: "online",
  participationType: "team",
  minTeamSize: 1,
  maxTeamSize: 5,
  deadline: "",
  startDate: "",
  endDate: "",
  tags: [],
  entryFee: 0,
  maxParticipants: 100,
};

// -------------------------------------------------------
export default function CreateEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<Hackathon[]>([]);
  const [form, setForm] = useState<HackathonForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setEvents(mockHackathons);
  }, []);

  // -------------------------------------------------------
  // SUBMIT HANDLER — FIXED PAYLOAD
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Omit<
        Hackathon,
        "id" | "registeredCount" | "interestedCount" | "status"
      > = {
        eventName: form.eventName,
        description: form.description || "",
        organizerId: form.organizerId,
        location: form.location || "",
        mode: form.mode,
        participationType: form.participationType,
        minTeamSize: form.minTeamSize,
        maxTeamSize: form.maxTeamSize,
        deadline: form.deadline,
        startDate: form.startDate,
        endDate: form.endDate,
        tags: form.tags,
        entryFee: form.entryFee,
        maxParticipants: form.maxParticipants,
        createdAt: new Date().toISOString(),
      };

      if (editingId) {
        await hackathonService.update(editingId, payload);
        toast({ title: "Event updated successfully" });

        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingId ? { ...ev, ...payload } : ev))
        );
      } else {
        const newEvent = await hackathonService.create(payload);
        toast({ title: "Event created successfully" });

        setEvents((prev) => [newEvent, ...prev]);
      }

      setForm(initialForm);
      setEditingId(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------
  // EDIT HANDLER FIXED FOR NEW TYPE
  // -------------------------------------------------------
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
      deadline: hack.deadline ?? "",
      startDate: hack.startDate ?? "",
      endDate: hack.endDate ?? "",
      tags: hack.tags ?? [],
      entryFee: hack.entryFee ?? 0,
      maxParticipants: hack.maxParticipants ?? 100,
    });

    setEditingId(hack.id);
    setIsDialogOpen(true);
  };

  // -------------------------------------------------------
  const handleDelete = async (id: string) => {
    try {
      await hackathonService.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Event deleted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
    setDeleteConfirmId(null);
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const getOrganizerName = (id: string) =>
    mockUsers.find((u) => u.id === id)?.name ?? "Unknown";

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="text-muted-foreground">Create and edit hackathons.</p>
          </div>

          <Button
            onClick={() => {
              setForm(initialForm);
              setEditingId(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>

        {/* EVENTS LIST */}
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold">{event.eventName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getOrganizerName(event.organizerId)} • {event.location} •{" "}
                    {event.mode}
                  </p>

                  <div className="flex gap-1 mt-2">
                    {(event.tags ?? []).slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{event.status ?? "N/A"}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/events/${event.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(event)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirmId(event.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EVENT FORM DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Event" : "Create Event"}
              </DialogTitle>
              <DialogDescription>Fill event details below.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EVENT NAME */}
              <div className="space-y-2">
                <Label>Event Name</Label>
                <Input
                  value={form.eventName}
                  onChange={(e) =>
                    setForm({ ...form, eventName: e.target.value })
                  }
                  required
                />
              </div>

              {/* ORGANIZER */}
              <div className="space-y-2">
                <Label>Organizer</Label>
                <Select
                  value={form.organizerId}
                  onValueChange={(v) => setForm({ ...form, organizerId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers
                      .filter((u) => u.role === "organizer")
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              {/* LOCATION + MODE */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select
                    value={form.mode}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        mode: v as "online" | "offline" | "hybrid",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PARTICIPATION TYPE */}
              <div className="space-y-2">
                <Label>Participation Type</Label>
                <Select
                  value={form.participationType}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      participationType: v as "individual" | "team",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TEAM SIZE IF TEAM */}
              {form.participationType === "team" && (
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={form.minTeamSize}
                      onChange={(e) =>
                        setForm({ ...form, minTeamSize: +e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      min={form.minTeamSize}
                      value={form.maxTeamSize}
                      onChange={(e) =>
                        setForm({ ...form, maxTeamSize: +e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* DATES */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* ENTRY FEE & MAX PARTICIPANTS */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Entry Fee</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.entryFee}
                    onChange={(e) =>
                      setForm({ ...form, entryFee: +e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Participants</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.maxParticipants}
                    onChange={(e) =>
                      setForm({ ...form, maxParticipants: +e.target.value })
                    }
                  />
                </div>
              </div>

              {/* TAGS */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={form.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                    ? "Update Event"
                    : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION */}
        <Dialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
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
