// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'organizer';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Hackathon Types
export interface Hackathon {
  id: string;
  name: string;
  description: string;
  organizer: string;
  organizerId: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  teamSize: { min: number; max: number };
  deadline: string;
  startDate: string;
  endDate: string;
  postedOn: string;
  tags: string[];
  entryFee?: number;
  prizes?: string[];
  requirements?: string[];
  participationType: 'individual' | 'team';
  maxParticipants?: number;
  registeredCount: number;
  interestedCount: number;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface HackathonRegistration {
  id: string;
  hackathonId: string;
  userId: string;
  teamName?: string;
  teamMembers: TeamMember[];
  contactEmail: string;
  contactPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

export interface TeamMember {
  name: string;
  email: string;
  role: string;
}

// User Analytics
export interface UserAnalytics {
  totalRegistered: number;
  wins: number;
  runnerUp: number;
  losses: number;
  participationHistory: ParticipationRecord[];
}

export interface ParticipationRecord {
  hackathonId: string;
  hackathonName: string;
  date: string;
  result: 'win' | 'runner-up' | 'loss' | 'pending';
  position?: number;
  teamName?: string;
}

// Admin Analytics
export interface AdminAnalytics {
  totalHackathons: number;
  averageTeamsPerHackathon: number;
  totalParticipants: number;
  totalBookingAmount: number;
  hackathonStats: HackathonStat[];
}

export interface HackathonStat {
  hackathonId: string;
  hackathonName: string;
  registeredTeams: number;
  totalParticipants: number;
  bookingAmount: number;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'nearby' | 'deadline' | 'update' | 'general';
  hackathonId?: string;
  distance?: number;
  read: boolean;
  createdAt: string;
}

// Filter Types
export interface HackathonFilters {
  mode?: 'online' | 'offline' | 'hybrid';
  participationType?: 'individual' | 'team';
  tags?: string[];
  dateRange?: { start: string; end: string };
  organizer?: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  code: string;
  description: string;
  ownerId: string;
  ownerName: string;
  members: TeamMemberInfo[];
  isPublic: boolean;
  createdAt: string;
}

export interface TeamMemberInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinedAt: string;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  code: string;
  createdBy: string;
  expiresAt: string;
  uses: number;
  maxUses?: number;
}

// Credits Types
export interface UserCredits {
  balance: number;
  transactions: CreditTransaction[];
}

export interface CreditTransaction {
  id: string;
  type: 'deposit' | 'deduction' | 'refund';
  amount: number;
  description: string;
  createdAt: string;
}
