import { useState } from 'react';
import { Copy, Check, Link, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Team } from '@/types';

interface InviteTeamModalProps {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteTeamModal({ team, open, onOpenChange }: InviteTeamModalProps) {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const inviteLink = `${window.location.origin}/teams/join?code=${team.code}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(team.code);
    setCopiedCode(true);
    toast({ title: 'Copied!', description: 'Team code copied to clipboard.' });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    toast({ title: 'Copied!', description: 'Invite link copied to clipboard.' });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sendEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Invite Sent!',
      description: `Invitation sent to ${email}.`,
    });
    
    setEmail('');
    setIsSending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Invite to {team.name}</DialogTitle>
          <DialogDescription>
            Share your team code or invite link with others.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team Code */}
          <div className="space-y-2">
            <Label>Team Code</Label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-md border border-border bg-muted/50 px-4 py-3 text-center font-mono text-xl tracking-widest">
                {team.code}
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={copyCode}>
                {copiedCode ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Invite Link */}
          <div className="space-y-2">
            <Label>Invite Link</Label>
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyLink}>
                {copiedLink ? <Check className="h-4 w-4 text-primary" /> : <Link className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Email Invite */}
          <form onSubmit={sendEmailInvite} className="space-y-2">
            <Label htmlFor="inviteEmail">Invite by Email</Label>
            <div className="flex gap-2">
              <Input
                id="inviteEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@example.com"
              />
              <Button type="submit" disabled={isSending || !email.trim()}>
                <Mail className="mr-2 h-4 w-4" />
                {isSending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}