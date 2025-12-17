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
  is_finalized?: boolean;

   // 🔥 UI STRING FIELDS
  requirementsText: string;
  prizesText: string;
  tagsText: string;
}

// ========================================
// REGISTRATION
// ========================================
export type RegistrationStatus = "pending" | "approved" | "rejected";

/* =========================
   TEAM TYPES (ORGANIZER VIEW)
========================= */

export interface TeamMember {
  user_id: number;
  role: "owner" | "coleader" | "member";
  joined_at: string;
}

export interface Team {
  id: string;
  name: string;
  created_by: number;
  members: TeamMember[];
}

/* =========================
   REGISTRATION
========================= */

export interface Registration {
  id: string;
  hackathon_id: string;

  user_id?: number | null;
  team_id?: string | null;

  status: RegistrationStatus;
  registered_at: string;

  // 🔥 Organizer-only enrichment
  team?: Team | null;
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
// export interface HackathonTeam {
//   id: string;
//   hackathonId: string;
//   name: string;
//   createdById: string;
//   createdAt: string;

//   members?: HackathonTeamMember[];
// }

// ========================================
// HACKATHON TEAMS ✅ (BACKEND SOURCE OF TRUTH)
// ========================================

export type TeamMemberRole = "owner" | "coleader" | "member";

// export interface HackathonTeamMember {
//   id: string;
//   hackathonTeamId: string;
//   userId: string;
//   joinedAt: string;

//   user?: User;
// }
export interface HackathonTeamMember {
  memberId: number;
  name: string;
  role: "owner" | "coleader" | "member";
  joinedAt: string;
}

export interface HackathonTeam {
  id: string;
  name: string;
  createdBy: number;
  createdAt: string;
  membersCount: number;
  members: HackathonTeamMember[];
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
