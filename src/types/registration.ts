export type TeamMember = {
  user_id: number;
  role: "owner" | "coleader" | "member";
  name : string;
  joined_at: string;
};

export type Team = {
  id: string;
  name: string;
  created_by: number;
  members: TeamMember[];
};

export type Registration = {
  id: string;
  hackathon_id: string;
  user_id: number | null;
  team_id: string | null;
  status: "pending" | "approved" | "rejected";
  registered_at: string;
  team: Team | null;
};
