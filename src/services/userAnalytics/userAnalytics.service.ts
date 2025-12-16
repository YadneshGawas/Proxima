const BASE_URL = import.meta.env.VITE_API_URL;

export interface CurrentTeam {
  id: string;
  name: string;
  hackathon_id: string | null;
}

export interface RecentParticipation {
  hackathon_id: string;
  hackathon_name: string;
  team_name: string;
  position: number | null;
  participated_at: string;
}

export interface UserAnalyticsResponse {
  total_hackathons: number;
  wins: number;
  runner_up: number;
  participated: number;
  current_team: CurrentTeam | null;
  recent_participation: RecentParticipation[];
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
    throw new Error(message);
  }

  return data;
};

export const userAnalyticsService = {
  getMe(): Promise<UserAnalyticsResponse> {
    const url = `${BASE_URL}/users/analytics/me`;
    console.log("[UserAnalytics] Getting user analytics:", { url });

    return fetch(url, {
      headers: authHeaders(),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[UserAnalytics] Analytics response:", result);
        return result;
      })
      .catch((err) => {
        console.error("[UserAnalytics] Error:", err);
        throw err;
      });
  },
};
