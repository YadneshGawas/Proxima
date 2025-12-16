import { Registration } from "@/types";

/* ======================================================
   CONFIG
====================================================== */

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const authHeaders = () => {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* ======================================================
   TYPES
====================================================== */

export interface RegistrationCheckResponse {
  registered: boolean;
  status?: "pending" | "approved" | "rejected";
  mode?: "individual" | "team";
  registration_id?: string;
  team_id?: string | null;
}

export interface RegistrationAnalytics {
  approved: number;
  pending: number;
  rejected: number;
  total_participants: number;
  total_registrations: number;
}

/* ======================================================
   SERVICE
====================================================== */

export const registrationService = {
  /* -------------------------
     REGISTER
  -------------------------- */
  async register(
    hackathonId: string,
    teamId?: string
  ): Promise<Registration> {
    const res = await fetch(`${BASE_URL}/register/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        hackathon_id: hackathonId,
        team_id: teamId ?? null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return {
      id: data.id,
      hackathonId: data.hackathon_id,
      userId: data.user_id,
      teamId: data.team_id,
      status: data.status,
      registeredAt: data.registered_at,
      team: data.team ?? null,
    };
  },

  /* -------------------------
     MY REGISTRATIONS
  -------------------------- */
  async getMyRegistrations(): Promise<Registration[]> {
    const res = await fetch(`${BASE_URL}/register/me`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch registrations");
    }

    return res.json();
  },

  /* -------------------------
     REGISTRATIONS BY HACKATHON (ADMIN)
  -------------------------- */
  async getByHackathon(
    hackathonId: string
  ): Promise<Registration[]> {
    const res = await fetch(
      `${BASE_URL}/register/hackathon/${hackathonId}`,
      { headers: authHeaders() }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch hackathon registrations");
    }

    return res.json();
  },

  /* -------------------------
     ANALYTICS
  -------------------------- */
  async getAnalytics(
    hackathonId: string
  ): Promise<RegistrationAnalytics> {
    const res = await fetch(
      `${BASE_URL}/register/analytics/${hackathonId}`,
      { headers: authHeaders() }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch registration analytics");
    }

    return res.json();
  },

  /* -------------------------
     APPROVE / REJECT
  -------------------------- */
  async updateStatus(
    registrationId: string,
    status: "approved" | "rejected"
  ): Promise<Registration> {
    const res = await fetch(
      `${BASE_URL}/register/${registrationId}/status`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update registration status");
    }

    return res.json();
  },

  /* -------------------------
     CHECK REGISTRATION (USER)
  -------------------------- */
  async checkRegistration(
    hackathonId: string
  ): Promise<RegistrationCheckResponse> {
    const res = await fetch(
      `${BASE_URL}/register/check/${hackathonId}`,
      {
        headers: authHeaders(),
      }
    );

    if (!res.ok) {
      // 401 should NOT crash the page
      if (res.status === 401) {
        return { registered: false };
      }

      throw new Error("Failed to check registration status");
    }

    return res.json();
  },
};
