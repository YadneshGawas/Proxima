const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("[Submission Service] Initialized with BASE_URL:", BASE_URL);

export interface TeamMember {
  user_id: number;
  name: string;
  role: string;
  joined_at: string;
}

export interface Team {
  id: string;
  name: string;
  created_by: number;
  members: TeamMember[];
}

export interface ProjectSubmission {
  id: string;
  hackathon_id: string;
  project_title: string;
  project_desc: string;
  github_url: string;
  live_url?: string;
  created_at: string;
  average_score?: number;
  team: Team;
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
});

const handleResponse = async (response: Response) => {
  const text = await response.text();
  
  if (!response.ok) {
    try {
      const error = JSON.parse(text);
      throw new Error(error.message || `HTTP ${response.status}`);
    } catch {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export interface CreateSubmissionPayload {
  team_id: string;
  project_title: string;
  project_desc: string;
  github_url: string;
  live_url?: string;
}

export interface UpdateSubmissionPayload {
  project_title: string;
  project_desc: string;
  github_url: string;
  live_url?: string;
}

export const submissionService = {
  create(hackathonId: string, payload: CreateSubmissionPayload): Promise<{ id: string }> {
    const url = `${BASE_URL}/submissions/hackathons/${hackathonId}`;
    console.log("[Submission] Creating submission:", { url, payload });
    
    return fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Submission] Create response:", result);
        return result;
      })
      .catch((err) => {
        console.error("[Submission] Create error:", err);
        throw err;
      });
  },

  update(submissionId: string, payload: UpdateSubmissionPayload): Promise<{ id: string; message: string }> {
    const url = `${BASE_URL}/submissions/${submissionId}`;
    console.log("[Submission] Updating submission:", { url, payload });
    
    return fetch(url, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Submission] Update response:", result);
        return result;
      })
      .catch((err) => {
        console.error("[Submission] Update error:", err);
        throw err;
      });
  },

  listByHackathon(hackathonId: string): Promise<ProjectSubmission[]> {
    const url = `${BASE_URL}/submissions/hackathons/${hackathonId}`;
    console.log("[Submission] Listing submissions:", { url, token: !!localStorage.getItem("auth_token") });
    
    return fetch(url, {
      headers: authHeaders(),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Submission] List response:", result);
        return Array.isArray(result) ? result : [];
      })
      .catch((err) => {
        console.error("[Submission] List error:", err);
        throw err;
      });
  },

  getById(submissionId: string): Promise<ProjectSubmission> {
    const url = `${BASE_URL}/submissions/${submissionId}`;
    console.log("[Submission] Getting submission:", { url });
    
    return fetch(url, {
      headers: authHeaders(),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Submission] Get response:", result);
        return result;
      })
      .catch((err) => {
        console.error("[Submission] Get error:", err);
        throw err;
      });
  },

  score(submissionId: string, score: number): Promise<{ message: string }> {
    const url = `${BASE_URL}/submissions/${submissionId}/score`;
    console.log("[Submission] Submitting score:", { url, score });
    
    return fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ score }),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Submission] Score response:", result);
        return result;
      })
      .catch((err) => {
        console.error("[Submission] Score error:", err);
        throw err;
      });
  },

  finalizeWinners(hackathonId: string): Promise<Array<{
    position: number;
    team: string;
    score: number;
  }>> {
    const url = `${BASE_URL}/submissions/hackathons/${hackathonId}/finalize`;
    console.log("[Submission] Finalizing winners:", { url });
    
    return fetch(url, {
      method: "POST",
      headers: authHeaders(),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Submission] Finalize response:", result);
        return result;
      })
      .catch((err) => {
        console.error("[Submission] Finalize error:", err);
        throw err;
      });
  },

  getUserSubmission(hackathonId: string): Promise<ProjectSubmission | null> {
    const url = `${BASE_URL}/submissions/hackathons/${hackathonId}/my-submission`;
    console.log("[Submission] Getting user submission:", { url });
    
    return fetch(url, {
      headers: authHeaders(),
    })
      .then(handleResponse)
      .then((result) => {
        console.log("[Submission] User submission response:", result);
        return result;
      })
      .catch((err) => {
        // 404 means no submission found, which is OK
        if (err.message?.includes("404")) {
          return null;
        }
        console.error("[Submission] Get user submission error:", err);
        throw err;
      });
  },
};
