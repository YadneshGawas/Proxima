/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
/**
 * API Service Layer — UPDATED for new mock DB and dynamic analytics
 *
 * - Uses your frontend types from '@/types'
 * - Uses DB-shaped mock data from '@/data/mockData'
 * - analyticsService.getUserAnalytics(userId) computes analytics from mock data (no hard-coded analytics)
 *
 * NOTE: Replace mock implementations with real apiCall(...) functions when wiring to your backend.
 */

import {
  User,
  Hackathon,
  Registration,
  UserAnalytics,
  AdminAnalytics,
  Notification,
  HackathonFilters,
  GlobalTeam,
  GlobalTeamMember,
  HackathonTeam,
  HackathonTeamMember,
  Winner,
  Payment,
  UserCredits,
} from "@/types";

import {
  mockUsers,
  mockHackathons,
  mockTeams,
  mockRegistrations,
  mockHackathonTeams,
  mockWinners,
  mockNotifications,
} from "@/data/mockData";

// Base URL for future real API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* helper: simulate latency in mocks */
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

/* =========
   Helper utilities over mock data
   ========= */

function findUserById(userId: string): User | undefined {
  return mockUsers.find((u) => u.id === userId);
}

function findHackathonById(hId: string): Hackathon | undefined {
  return mockHackathons.find((h) => h.id === hId);
}

function getGlobalTeamMembers(teamId: string): GlobalTeamMember[] {
  const team = mockTeams.find((t) => t.id === teamId);
  return team?.members || [];
}

function getHackathonTeamMembers(hTeamId: string): HackathonTeamMember[] {
  const ht = mockHackathonTeams.find((t) => t.id === hTeamId);
  return ht?.members || [];
}

/**
 * Return registrations where user participates:
 * - individual registration where registration.userId === userId
 * - registrations by globalTeam where the team contains the user
 * - registrations by hackathonTeam where the hackathonTeam contains the user
 */
function getRegistrationsForUser(userId: string): Registration[] {
  // direct individual registrations
  const individual = mockRegistrations.filter((r) => r.userId === userId);

  // global team registrations where user is member
  const teamRegistrations = mockRegistrations.filter((r) => {
    if (!r.globalTeamId) return false;
    const members = getGlobalTeamMembers(r.globalTeamId);
    return members.some((m) => m.userId === userId);
  });

  // hackathon team registrations where user is member
  const hteamRegistrations = mockRegistrations.filter((r) => {
    if (!r.hackathonTeamId) return false;
    const members = getHackathonTeamMembers(r.hackathonTeamId);
    return members.some((m) => m.userId === userId);
  });

  // Merge and dedupe by registration id (just in case)
  const combined = [...individual, ...teamRegistrations, ...hteamRegistrations];
  const deduped: { [id: string]: Registration } = {};
  combined.forEach((r) => (deduped[r.id] = r));
  return Object.values(deduped);
}

/**
 * For a given user and hackathonId, determine the result:
 * - Find if any hackathonTeam that the user belongs to has a Winner entry for that hackathon.
 * - If not, check if any hackathonTeam for that hackathon was registered and user part of it -> treated as participated (loss or pending)
 *
 * Returns:
 *  { result: 'win' | 'runner-up' | 'second-runner-up' | 'loss' | 'pending', position?: number, winnerEntry?: Winner }
 */
function computeUserResultForHackathon(userId: string, hackathonId: string): { result: string; position?: number; winner?: Winner | undefined } {
  // 1. Check hackathon teams that user belongs to
  const userHTeamIds = mockHackathonTeams
    .filter((ht) => ht.hackathonId === hackathonId)
    .filter((ht) => (ht.members || []).some((m) => m.userId === userId))
    .map((ht) => ht.id);

  // 2. See if any winner corresponds to these hteam ids
  for (const w of mockWinners.filter((w) => w.hackathonId === hackathonId)) {
    if (userHTeamIds.includes(w.hackathonTeamId)) {
      // map position to result label
      if (w.position === 1) return { result: "win", position: 1, winner: w };
      if (w.position === 2) return { result: "runner-up", position: 2, winner: w };
      if (w.position === 3) return { result: "second-runner-up", position: 3, winner: w };
    }
  }

  // 3. If user was registered (via global team / hackathon team / individual) for this hackathon -> mark as loss/participated
  const reg = mockRegistrations.find((r) => {
    if (r.hackathonId !== hackathonId) return false;
    // individual registration by user:
    if (r.userId === userId) return true;
    // global team registration that includes user
    if (r.globalTeamId) {
      const members = getGlobalTeamMembers(r.globalTeamId);
      if (members.some((m) => m.userId === userId)) return true;
    }
    // hackathon team registration that includes user
    if (r.hackathonTeamId) {
      const members = getHackathonTeamMembers(r.hackathonTeamId);
      if (members.some((m) => m.userId === userId)) return true;
    }
    return false;
  });

  if (reg) {
    // If registration status is pending (status === 0), mark pending
    if (reg.status === 0) return { result: "pending" };
    // else mark as loss/participated
    return { result: "loss" };
  }

  // If user not registered, return pending (or not participated)
  return { result: "pending" };
}

/* =========
   Mock API / Services (public API preserved)
   ========= */

/* AUTH SERVICE */
// export const authService = {
//   login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
//     // mock: return first matching user by email or demo user u1
//     await delay(400);
//     const found = mockUsers.find((u) => u.email === email) || mockUsers[0];
//     return { user: found, token: "mock-jwt-token" };
//   },

//   register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
//     await delay(500);
//     // simplistic: return a new user object (not mutating mockUsers file)
//     const newUser: User = {
//       id: String(Date.now()),
//       name,
//       email,
//       avatar: "",
//       code: `USR${String(Math.floor(Math.random() * 9000) + 1000)}`,
//       createdAt: new Date().toISOString(),
//       credits: 0,
//       role: "user",
//     };
//     return { user: newUser, token: "mock-jwt-token" };
//   },

//   loginWithGoogle: async (token: string) => {
//     await delay(300);
//     return { user: mockUsers[0], token: "mock-jwt-token" };
//   },

//   loginWithFacebook: async (token: string) => {
//     await delay(300);
//     return { user: mockUsers[0], token: "mock-jwt-token" };
//   },

//   logout: async () => {
//     await delay(150);
//   },

//   getCurrentUser: async () => {
//     await delay(200);
//     // For demo, return first user (id="u1")
//     return mockUsers[0];
//   },

//   becomeOrganizer: async (userId: string) => {
//     await delay(250);
//     const u = findUserById(userId);
//     if (!u) throw new Error("User not found");
//     // Return a shallow copy with role changed (do not mutate original mock data)
//     return { ...u, role: "organizer" } as User;
//   },
// };

/* HACKATHON SERVICE */
// export const hackathonService = {
//   getAll: async (filters?: HackathonFilters): Promise<Hackathon[]> => {
//     await delay(300);
//     let filtered = [...mockHackathons];

//     if (!filters) return filtered;

//     if (filters.mode) filtered = filtered.filter((h) => h.mode === filters.mode);
//     if (filters.participationType) filtered = filtered.filter((h) => h.participationType === filters.participationType);
//     if (filters.tags && filters.tags.length) {
//       filtered = filtered.filter((h) => Array.isArray(h.tags) && h.tags.some((t) => filters.tags!.includes(t)));
//     }
//     if (filters.organizer) filtered = filtered.filter((h) => h.organizerId === filters.organizer);

//     if (filters.dateRange?.start) {
//       const start = new Date(filters.dateRange.start);
//       filtered = filtered.filter((h) => (h.startDate ? new Date(h.startDate) >= start : true));
//     }
//     if (filters.dateRange?.end) {
//       const end = new Date(filters.dateRange.end);
//       filtered = filtered.filter((h) => (h.endDate ? new Date(h.endDate) <= end : true));
//     }

//     return filtered;
//   },

//   getById: async (id: string): Promise<Hackathon> => {
//     await delay(250);
//     const found = mockHackathons.find((h) => h.id === id);
//     if (!found) throw new Error("Hackathon not found");
//     return found;
//   },

//   getNearby: async (_lat: number, _lng: number, _radius: number = 50): Promise<Hackathon[]> => {
//     await delay(250);
//     return mockHackathons.filter((h) => h.mode === "offline" || h.mode === "hybrid");
//   },

//   create: async (hackathon: Omit<Hackathon, "id" | "registeredCount" | "interestedCount" | "status">): Promise<Hackathon> => {
//     await delay(300);
//     return {
//       ...hackathon,
//       id: String(Date.now()),
//       registeredCount: 0,
//       interestedCount: 0,
//       status: "upcoming",
//     } as Hackathon;
//   },

//   update: async (id: string, data: Partial<Hackathon>): Promise<Hackathon> => {
//     await delay(300);
//     const existing = mockHackathons.find((h) => h.id === id);
//     if (!existing) throw new Error("Hackathon not found");
//     return { ...existing, ...data };
//   },

//   delete: async (id: string): Promise<void> => {
//     await delay(200);
//   },

//   markInterested: async (hackathonId: string, userId: string): Promise<void> => {
//     await delay(150);
//     // mock: nothing to persist
//   },
// };

/* REGISTRATION SERVICE */
export const registrationService = {
  /**
   * register: Accepts a Registration-like payload but without id/status/registeredAt
   * For frontend compatibility we accept:
   *  {
   *    hackathonId,
   *    userId? (individual),
   *    globalTeamId? (global team),
   *    hackathonTeamId? (hackathon team)
   *  }
   */
  register: async (payload: Omit<Registration, "id" | "registeredAt" | "status">): Promise<Registration> => {
    await delay(350);
    // NOTE: This mock does not validate duplicates/unique constraints strictly.
    return {
      ...payload,
      id: String(Date.now()),
      status: 0,
      registeredAt: new Date().toISOString(),
    } as Registration;
  },

  getByHackathon: async (hackathonId: string): Promise<Registration[]> => {
    await delay(300);
    return mockRegistrations.filter((r) => r.hackathonId === hackathonId);
  },

  getByUser: async (userId: string): Promise<Registration[]> => {
    await delay(300);
    return mockRegistrations.filter((r) => {
      if (r.userId === userId) return true;
      if (r.globalTeamId) {
        const members = getGlobalTeamMembers(r.globalTeamId);
        if (members.some((m) => m.userId === userId)) return true;
      }
      if (r.hackathonTeamId) {
        const members = getHackathonTeamMembers(r.hackathonTeamId);
        if (members.some((m) => m.userId === userId)) return true;
      }
      return false;
    });
  },

  updateStatus: async (registrationId: string, status: 1 | 2): Promise<Registration> => {
    await delay(250);
    const reg = mockRegistrations.find((r) => r.id === registrationId);
    if (!reg) throw new Error("Registration not found");
    // return copy with updated status
    return { ...reg, status };
  },

  delete: async (registrationId: string): Promise<void> => {
    await delay(200);
  },
};

/* ANALYTICS SERVICE (DYNAMIC: computed from mock DB) */
export const analyticsService = {
  getUserAnalytics: async (userId: string, filters?: HackathonFilters): Promise<UserAnalytics> => {
    await delay(300);

    // 1. Gather registrations relevant to user (individual / via teams / via hackathon teams)
    const regs = getRegistrationsForUser(userId);

    // Optionally apply hackathon filters to registration set (if filters provided)
    const filteredRegs = regs.filter((r) => {
      if (!filters) return true;
      const h = r.hackathonId ? findHackathonById(r.hackathonId) : undefined;
      if (!h) return true;
      if (filters.mode && h.mode !== filters.mode) return false;
      if (filters.participationType && h.participationType !== filters.participationType) return false;
      if (filters.tags && filters.tags.length) {
        if (!h.tags || !h.tags.some((t) => filters.tags!.includes(t))) return false;
      }
      if (filters.dateRange?.start) {
        const start = new Date(filters.dateRange.start);
        if (h.startDate && new Date(h.startDate) < start) return false;
      }
      if (filters.dateRange?.end) {
        const end = new Date(filters.dateRange.end);
        if (h.endDate && new Date(h.endDate) > end) return false;
      }
      return true;
    });

    // 2. For each registration, build ParticipationRecord
    const participationHistory = filteredRegs.map((r) => {
      const hack = findHackathonById(r.hackathonId);
      const hackName = hack ? hack.eventName : "Unknown Hackathon";
      const date = hack?.startDate || r.registeredAt || new Date().toISOString();

      // Determine result using computeUserResultForHackathon
      const { result, position } = computeUserResultForHackathon(userId, r.hackathonId);

      return {
        hackathonId: r.hackathonId,
        hackathonName: hackName,
        date,
        result: (result as any) as "win" | "runner-up" | "second-runner-up" | "pending" | "loss",
        position,
        teamName: (() => {
          // We don't have teamName on registration; pick team's code if available for display
          if (r.globalTeamId) {
            const t = mockTeams.find((tt) => tt.id === r.globalTeamId);
            return t?.name;
          }
          if (r.hackathonTeamId) {
            const ht = mockHackathonTeams.find((x) => x.id === r.hackathonTeamId);
            return ht?.name;
          }
          return undefined;
        })(),
      };
    });

    // 3. Aggregate totals
    const totalRegistered = participationHistory.length;
    let wins = 0;
    let runnerUp = 0;
    let losses = 0;

    for (const p of participationHistory) {
      if (p.result === "win") wins++;
      else if (p.result === "runner-up") runnerUp++;
      else if (p.result === "second-runner-up" || p.result === "loss") losses++;
    }

    // If user has zero registrations, participationHistory may be empty - still return shape
    const analytics: UserAnalytics = {
      totalRegistered,
      wins,
      runnerUp,
      losses,
      participationHistory,
    };

    return analytics;
  },

  getAdminAnalytics: async (organizerId: string): Promise<AdminAnalytics> => {
    await delay(350);
    // Simple aggregation over mockHackathons organized by organizerId
    const organizes = mockHackathons.filter((h) => h.organizerId === organizerId);
    const totalHackathons = mockHackathons.length;
    const totalParticipants = mockRegistrations.length; // rough
    const hackathonStats = organizes.map((h) => {
      const regs = mockRegistrations.filter((r) => r.hackathonId === h.id);
      // count unique teams (globalTeamId or hackathonTeamId) roughly
      const registeredTeams = regs.filter((r) => r.globalTeamId || r.hackathonTeamId).length;
      const bookingAmount = regs.reduce((s, r) => {
        // try to get hackathon entryFee
        const entry = h.entryFee || 0;
        // if registration is individual, count entry
        if (r.userId && entry > 0) return s + entry;
        // if globalTeam or hackathonTeam, assume one payment per team: add entry once per team (approx)
        if ((r.globalTeamId || r.hackathonTeamId) && entry > 0) return s + entry;
        return s;
      }, 0);
      return {
        hackathonId: h.id,
        hackathonName: h.eventName,
        registeredTeams,
        totalParticipants: regs.length,
        bookingAmount,
      };
    });

    const adminAnalytics: AdminAnalytics = {
      totalHackathons,
      averageTeamsPerHackathon: Math.round(hackathonStats.reduce((s, x) => s + x.registeredTeams, 0) / Math.max(1, hackathonStats.length)),
      totalParticipants,
      totalBookingAmount: hackathonStats.reduce((s, x) => s + x.bookingAmount, 0),
      hackathonStats,
    };

    return adminAnalytics;
  },
};

/* NOTIFICATION SERVICE */
export const notificationService = {
  getAll: async (userId: string): Promise<Notification[]> => {
    await delay(200);
    // For demo: return all notifications that reference hackathons the user is registered for OR global mockNotifications
    const userRegs = getRegistrationsForUser(userId).map((r) => r.hackathonId);
    return mockNotifications.filter((n) => !n.hackathonId || userRegs.includes(n.hackathonId));
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await delay(150);
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await delay(150);
  },
};

/* LOCATION SERVICE (unchanged) */
export const locationService = {
  getCurrentLocation: (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};

/* Export mock data accessors (optional, helpful for tests) */
export const __mock = {
  users: mockUsers,
  hackathons: mockHackathons,
  teams: mockTeams,
  registrations: mockRegistrations,
  hackathonTeams: mockHackathonTeams,
  winners: mockWinners,
  notifications: mockNotifications,
};
