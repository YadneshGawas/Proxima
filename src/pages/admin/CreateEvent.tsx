import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Hackathon } from '@/types';
import { hackathonService } from '@/services/api';
import { availableTags, mockHackathons } from '@/data/mockData';

interface HackathonForm {
  name: string;
  description: string;
  organizer: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  teamSizeMin: number;
  teamSizeMax: number;
  deadline: string;
  startDate: string;
  endDate: string;
  tags: string[];
  entryFee: number;
  participationType: 'individual' | 'team';
  maxParticipants: number;
}

const initialForm: HackathonForm = {
  name: '',
  description: '',
  organizer: '',
  location: '',
  mode: 'online',
  teamSizeMin: 1,
  teamSizeMax: 5,
  deadline: '',
  startDate: '',
  endDate: '',
  tags: [],
  entryFee: 0,
  participationType: 'team',
  maxParticipants: 100,
};

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
    // Load existing events
    setEvents(mockHackathons);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hackathonData = {
        name: form.name,
        description: form.description,
        organizer: form.organizer,
        organizerId: 'org1',
        location: form.location,
        mode: form.mode,
        teamSize: { min: form.teamSizeMin, max: form.teamSizeMax },
        deadline: form.deadline,
        startDate: form.startDate,
        endDate: form.endDate,
        postedOn: new Date().toISOString().split('T')[0],
        tags: form.tags,
        entryFee: form.entryFee || undefined,
        participationType: form.participationType,
        maxParticipants: form.maxParticipants,
      };

      if (editingId) {
        await hackathonService.update(editingId, hackathonData);
        toast({ title: 'Event updated successfully!' });
      } else {
        const newEvent = await hackathonService.create(hackathonData);
        setEvents([newEvent, ...events]);
        toast({ title: 'Event created successfully!' });
      }

      setForm(initialForm);
      setEditingId(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (hackathon: Hackathon) => {
    setForm({
      name: hackathon.name,
      description: hackathon.description,
      organizer: hackathon.organizer,
      location: hackathon.location,
      mode: hackathon.mode,
      teamSizeMin: hackathon.teamSize.min,
      teamSizeMax: hackathon.teamSize.max,
      deadline: hackathon.deadline,
      startDate: hackathon.startDate,
      endDate: hackathon.endDate,
      tags: hackathon.tags,
      entryFee: hackathon.entryFee || 0,
      participationType: hackathon.participationType,
      maxParticipants: hackathon.maxParticipants || 100,
    });
    setEditingId(hackathon.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await hackathonService.delete(id);
      setEvents(events.filter((e) => e.id !== id));
      toast({ title: 'Event deleted successfully!' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event.',
        variant: 'destructive',
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Events</h1>
            <p className="text-muted-foreground">Create and manage your hackathons.</p>
          </div>
          <Button onClick={() => { setForm(initialForm); setEditingId(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Events List */}
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.organizer} • {event.location} • {event.mode}
                  </p>
                  <div className="mt-2 flex gap-1">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/events/${event.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
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

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              <DialogDescription>
                Fill in the details for your hackathon event.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="TechCrunch Disrupt 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={form.organizer}
                  onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                  placeholder="Your Organization"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your hackathon..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="San Francisco, CA or Online"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select
                    value={form.mode}
                    onValueChange={(value: any) => setForm({ ...form, mode: value })}
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Participation Type</Label>
                  <Select
                    value={form.participationType}
                    onValueChange={(value: any) => setForm({ ...form, participationType: value })}
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
                {form.participationType === 'team' && (
                  <div className="space-y-2">
                    <Label>Team Size</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={form.teamSizeMin}
                        onChange={(e) => setForm({ ...form, teamSizeMin: parseInt(e.target.value) })}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        min="1"
                        value={form.teamSizeMax}
                        onChange={(e) => setForm({ ...form, teamSizeMax: parseInt(e.target.value) })}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entryFee">Entry Fee ($)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    min="0"
                    value={form.entryFee}
                    onChange={(e) => setForm({ ...form, entryFee: parseInt(e.target.value) })}
                    placeholder="0 for free"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={form.maxParticipants}
                    onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={form.tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
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
