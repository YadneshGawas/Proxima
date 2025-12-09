import { useState } from 'react';
import { Search, Users, Plus, Globe, Lock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockTeams } from '@/data/mockData';
import { Team } from '@/types';
import { useNavigate } from 'react-router-dom';
import { CreateTeamModal } from '@/components/CreateTeamModal';
import { JoinTeamModal } from '@/components/JoinTeamModal';

export default function Teams() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const publicTeams = mockTeams.filter(team => team.isPublic);

  const filteredTeams = publicTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recommendedTeams = publicTeams.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams</h1>
            <p className="text-muted-foreground">Discover and join teams for hackathons</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setJoinModalOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Join with Code
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams by name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Recommended Teams */}
        {!searchQuery && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recommended for You</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedTeams.map((team) => (
                <TeamCard key={team.id} team={team} onClick={() => navigate(`/teams/${team.id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* All Public Teams */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {searchQuery ? 'Search Results' : 'Discover Public Teams'}
          </h2>
          {filteredTeams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No teams found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} onClick={() => navigate(`/teams/${team.id}`)} />
              ))}
            </div>
          )}
        </section>
      </div>

      <CreateTeamModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <JoinTeamModal open={joinModalOpen} onOpenChange={setJoinModalOpen} />
    </DashboardLayout>
  );
}

interface TeamCardProps {
  team: Team;
  onClick: () => void;
}

function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{team.name}</CardTitle>
          <Badge variant={team.isPublic ? 'secondary' : 'outline'} className="flex items-center gap-1">
            {team.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {team.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Code:</span>
          <Badge variant="outline" className="font-mono">{team.code}</Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Owner:</span>
          <span className="font-medium text-foreground">{team.ownerName}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{team.members.length - 4}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {team.members.length} member{team.members.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}