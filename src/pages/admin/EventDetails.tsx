import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Pencil, Trash2, Check, X } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Hackathon, HackathonRegistration } from '@/types';
import { hackathonService, registrationService } from '@/services/api';
import { mockHackathons, mockRegistrations } from '@/data/mockData';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [registrations, setRegistrations] = useState<HackathonRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReg, setEditingReg] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HackathonRegistration>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      // Use mock data
      const hack = mockHackathons.find(h => h.id === id);
      setHackathon(hack || null);
      setRegistrations(mockRegistrations.filter(r => r.hackathonId === id));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (regId: string, status: 'approved' | 'rejected') => {
    try {
      await registrationService.updateStatus(regId, status);
      setRegistrations(registrations.map(r =>
        r.id === regId ? { ...r, status } : r
      ));
      toast({ title: `Registration ${status}!` });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRegistration = async (regId: string) => {
    try {
      await registrationService.delete(regId);
      setRegistrations(registrations.filter(r => r.id !== regId));
      toast({ title: 'Registration deleted!' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete registration.',
        variant: 'destructive',
      });
    }
    setDeleteConfirmId(null);
  };

  const handleExportPDF = () => {
    // Create CSV content (simpler than PDF for demo)
    const headers = ['Team Name', 'Contact Email', 'Contact Phone', 'Status', 'Members'];
    const rows = registrations.map(r => [
      r.teamName || 'Individual',
      r.contactEmail,
      r.contactPhone,
      r.status,
      r.teamMembers.map(m => `${m.name} (${m.email})`).join('; ')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hackathon?.name || 'event'}-participants.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({ title: 'Exported!', description: 'Participant list downloaded as CSV.' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-primary text-primary-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
        </div>
      </AdminLayout>
    );
  }

  if (!hackathon) {
    return (
      <AdminLayout>
        <div className="text-center">
          <p className="text-muted-foreground">Event not found.</p>
          <Button variant="link" onClick={() => navigate('/admin/analytics')}>
            Back to Analytics
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/admin/analytics')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analytics
        </Button>

        {/* Event Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 w-full">
            
            {/* LEFT: Event details */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{hackathon.name}</h1>
              <p className="text-muted-foreground">
                {hackathon.organizer} • {hackathon.location}
              </p>

              <div className="mt-2 flex gap-2">
                <Badge variant={hackathon.status === "upcoming" ? "default" : "secondary"}>
                  {hackathon.status}
                </Badge>
                <Badge variant="outline">{hackathon.mode}</Badge>
              </div>
            </div>

            {/* RIGHT: Buttons */}
            <div className="flex items-center gap-3">
              <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/${id}/submission`)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View Submissions
                </Button>

              <Button onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export Participants
              </Button>
            </div>

          </div>


        {/* Event Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">
                {registrations.filter(r => r.status === 'approved').length}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">
                {registrations.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-foreground">
                {registrations.reduce((acc, r) => acc + r.teamMembers.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Participants</p>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Participants</CardTitle>
            <CardDescription>Manage and review registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No registrations yet.</p>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {reg.teamName || 'Individual Entry'}
                          </h3>
                          <Badge className={getStatusColor(reg.status)}>
                            {reg.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {reg.contactEmail} • {reg.contactPhone}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {reg.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(reg.id, 'approved')}
                            >
                              <Check className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(reg.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Team Members:</p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {reg.teamMembers.map((member, index) => (
                          <div
                            key={index}
                            className="rounded-md bg-muted/50 p-2 text-sm"
                          >
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                            <p className="text-xs text-primary">{member.role}</p>
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

        {/* Delete Confirmation */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Registration</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this registration? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDeleteRegistration(deleteConfirmId)}
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
