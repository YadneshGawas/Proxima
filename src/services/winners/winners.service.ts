const BASE_URL = import.meta.env.VITE_API_URL;

export interface WinnerTeamMember {
  user_id: string;
  name: string;
  role: string;
}

export interface WinnerTeam {
  id: string;
  name: string;
  members: WinnerTeamMember[];
}

export interface WinnerProject {
  id: string;
  title: string;
  github_url: string;
  live_url?: string;
}

export interface Winner {
  id: string;
  position: number; // 1, 2, or 3
  score: number;
  project: WinnerProject;
  team: WinnerTeam;
  created_at: string;
}

const authHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || "Request failed";
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return data;
};

export const winnersService = {
  finalize(hackathonId: string): Promise<{ message: string; count: number }> {
    const url = `${BASE_URL}/winners/hackathons/${hackathonId}/finalize`;
    console.log("[Winners] Finalizing winners:", { url });

    return fetch(url, {
      method: "POST",
      headers: authHeaders(),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Winners] Finalize response:", result);
        return result;
      })
      .catch((err) => {
        console.error("[Winners] Finalize error:", err);
        throw err;
      });
  },

  list(hackathonId: string): Promise<Winner[]> {
    const url = `${BASE_URL}/winners/hackathons/${hackathonId}`;
    console.log("[Winners] Listing winners:", { url });

    return fetch(url, {
      headers: authHeaders(),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Winners] List response:", result);
        return Array.isArray(result) ? result : result.winners || [];
      })
      .catch((err) => {
        console.error("[Winners] List error:", err);
        throw err;
      });
  },
};
