import { HackathonTeam } from "@/types";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const authHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const teamService = {
  /* ============================
     GET MY TEAMS
  ============================ */
  async getMyTeams(): Promise<{ results: HackathonTeam[]; total: number }> {
    const res = await fetch(`${BASE_URL}/team/my-teams`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch teams");
    }

    const data = await res.json();

    return {
      total: data.total,
      results: data.results.map((t: any) => ({
        id: t.team_id,
        name: t.team_name,
        createdBy: t.created_by,
        createdAt: t.created_at,
        membersCount: t.members_count,
        members: t.members.map((m: any) => ({
          memberId: m.member_id,
          name: m.name,
          role: m.role,
          joinedAt: m.joined_at,
        })),
      })),
    };
  },

  /* ============================
     GET TEAM BY ID
  ============================ */
  async getTeamById(teamId: string): Promise<HackathonTeam> {
    const res = await fetch(`${BASE_URL}/team/${teamId}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch team");
    }

    const t = await res.json();

    return {
      id: t.team_id,
      name: t.team_name,
      createdBy: t.members.find((m: any) => m.role === "owner")?.member_id,
      createdAt: t.members[0]?.joined_at, // closest available timestamp
      membersCount: t.members_count,
      members: t.members.map((m: any) => ({
        memberId: m.member_id,
        name: m.name,
        role: m.role,
        joinedAt: m.joined_at,
      })),
    };
  },

  /* ============================
     REMOVE MEMBER
  ============================ */
  async removeMember(teamId: string, memberId: number) {
    const res = await fetch(
      `${BASE_URL}/team/${teamId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to remove member");
    }
  },

  /* ============================
     GET ALL USERS (FOR ADD MEMBER)
  ============================ */
  async getAllUsers(): Promise<{ id: number; name: string }[]> {
    const res = await fetch(`${BASE_URL}/auth/get-all-users`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();
    return data.data;
  },

  /* ============================
     ADD MEMBER TO TEAM
  ============================ */
  async addMember(
    teamId: string,
    memberId: number,
    role: "member" | "coleader" = "member"
  ) {
    const res = await fetch(`${BASE_URL}/team/${teamId}/members`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        member_id: memberId,
        role,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to add member");
    }

    return res.json();
  },
    /* ============================
    CREATE TEAM
  ============================ */
  async createTeam(name: string): Promise<HackathonTeam> {
    const res = await fetch(`${BASE_URL}/team/create`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Failed to create team");
    }

    const t = await res.json();

    return {
      id: t.id,
      name: t.name,
      createdBy: t.created_by,
      createdAt: t.created_at,
      membersCount: 1,
      members: [
        {
          memberId: t.created_by,
          name: "You",
          role: "owner",
          joinedAt: t.created_at,
        },
      ],
    };
  }
};
