import { Hackathon } from "@/types";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const authHeaders = () => {
  const token = localStorage.getItem("auth_token"); // ✅ CORRECT KEY
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface HackathonListParams {
  page?: number;
  limit?: number;
  mode?: "online" | "offline" | "hybrid";
  participation_type?: "individual" | "team";
  tag?: string;
  search?: string;
  status?: "upcoming" | "ongoing" | "completed";
  mine?: boolean;
}

export interface HackathonListResponse {
  page: number;
  limit: number;
  total: number;
  results: Hackathon[];
}

export const hackathonApi = {
  async getAll(params: HackathonListParams): Promise<HackathonListResponse> {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const res = await fetch(`${BASE_URL}/hackathon/all?${query}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Hackathon list error:", text);
      throw new Error("Failed to fetch hackathons");
    }

    return res.json();
  },

  async getById(id: string): Promise<Hackathon> {
    const res = await fetch(`${BASE_URL}/hackathon/view/${id}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch hackathon");
    }

    return res.json();
  },

  async create(data: Partial<Hackathon>): Promise<Hackathon> {
    const res = await fetch(`${BASE_URL}/hackathon/create`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const response = await res.json(); // 👈 THIS
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", response);


    if (!res.ok) {
      throw new Error(response?.message || "Failed to create hackathon");
    }

    return response;

  },

  async update(id: string, data: any) {
    const res = await fetch(`${BASE_URL}/hackathon/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update hackathon");
    }

    return res.json(); // 👈 REQUIRED
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/hackathon/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to delete hackathon");
    }
  },

    async toggleInterest(id: string) {
    const res = await fetch(`${BASE_URL}/hackathon/interest/${id}`, {
      method: "POST",
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error("Failed to toggle interest");
    }

    return res.json(); // { interested_count, is_interested }
  }

};
