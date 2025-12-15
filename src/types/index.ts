// ========================================
// USER
// ========================================
export interface User {
  id: string;
  name?: string;
  email: string;
  avatar: string;
  code: string;
  createdAt: string;
  credits: number;

  // Frontend-only role field (not in DB)
  role: 'user' | 'organizer';
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ========================================
// HACKATHON
// ========================================
export interface Hackathon {
  id: string;
  organizerId: string;
  eventName: string;
  description?: string;
  location?: string;
  mode: 'online' | 'offline' | 'hybrid';

  participationType: 'individual' | 'team';
  minTeamSize?: number;
  maxTeamSize?: number;

  deadline?: string;
  startDate?: string;
  endDate?: string;

  entryFee: number;
  maxParticipants?: number;

  createdAt: string;
  archiveSnapshotId?: string;

  // Computed UI fields
  registeredCount?: number;
  interestedCount?: number;
  isInterested?: boolean;

  status?: 'upcoming' | 'ongoing' | 'completed';
  imageUrl?: string;

   // 🔥 UI STRING FIELDS
  requirementsText: string;
  prizesText: string;
  tagsText: string;
}

// ========================================
// REGISTRATION
// ========================================
export type RegistrationStatus = 0 | 1 | 2;
// 0 = pending, 1 = approved, 2 = rejected

export interface Registration {
  id: string;
  hackathonId: string;

  userId?: string;           // individual registration
  globalTeamId?: string;     // global team mode
  hackathonTeamId?: string;  // temp hackathon team mode

  registeredAt: string;
  status: RegistrationStatus;
}

// ========================================
// GLOBAL TEAMS
// ========================================
export interface GlobalTeam {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  teamCode: string;
  isPublic: boolean;
  createdAt: string;

  members?: GlobalTeamMember[];
}

export interface GlobalTeamMember {
  id: string;
  teamId: string;
  userId: string;
  role?: string; // leader / co-lead / member
  joinedAt: string;

  user?: User;
}

// ========================================
// HACKATHON TEAMS
// ========================================
export interface HackathonTeam {
  id: string;
  hackathonId: string;
  name: string;
  createdById: string;
  createdAt: string;

  members?: HackathonTeamMember[];
}

export interface HackathonTeamMember {
  id: string;
  hackathonTeamId: string;
  userId: string;
  joinedAt: string;

  user?: User;
}

// ========================================
// WINNERS
// ========================================
export interface Winner {
  id: string;
  hackathonId: string;
  hackathonTeamId: string;
  position: number; // 1 = Winner, 2 = Runner-up, 3 = Second Runner-up
  projectTitle: string;
  projectDesc: string;
  gitUrl: string;
  liveUrl: string;
  createdAt: string;
}

// ========================================
// PAYMENTS
// ========================================
export interface Payment {
  id: string;
  userId: string;
  hackathonId: string;
  amount: number;
  currency: string;
  status: string; // usually "completed"
  createdAt: string;
}

// ========================================
// USER ANALYTICS (frontend derived)
// ========================================
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
  result: 'win' | 'runner-up' | 'second-runner-up' | 'pending' | 'loss';
  position?: number;
  teamId?: string; // from global or hackathon team
}

// ========================================
// ADMIN ANALYTICS (frontend derived)
// ========================================
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

// ========================================
// NOTIFICATIONS (frontend)
// ========================================
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

// ========================================
// FILTERS
// ========================================
export interface HackathonFilters {
  mode?: 'online' | 'offline' | 'hybrid';
  participationType?: 'individual' | 'team';
  tags?: string[];
  dateRange?: { start: string; end: string };
  organizer?: string;
}

// ========================================
// CREDITS (frontend)
// ========================================
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
