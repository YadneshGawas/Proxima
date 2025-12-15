import {
  hackathonApi,
  HackathonListParams,
  HackathonListResponse,
} from "./hackathon.api";
import { Hackathon } from "@/types";

/* ------------------------------
   🔁 BACKEND → FRONTEND MAPPER
--------------------------------*/
const mapHackathon = (raw: any): Hackathon => ({
  id: raw.id,

  eventName: raw.event_name,
  description: raw.description,

  organizerId: raw.organizer_id,
  location: raw.location,

  mode: raw.mode,
  participationType: raw.participation_type,

  minTeamSize: raw.min_team_size,
  maxTeamSize: raw.max_team_size,

  deadline: raw.deadline,
  startDate: raw.start_date,
  endDate: raw.end_date,

  entryFee: raw.entry_fee,
  maxParticipants: raw.max_participants,

  createdAt: raw.created_at,

  interestedCount: raw.interested_count,
  isInterested: raw.is_interested,

  status: raw.status,

  imageUrl: raw.image_url,

  tags: raw.tags,
  requirements: raw.requirements,
  prizes: raw.prizes,
});

/* ------------------------------
   🔁 FRONTEND → BACKEND MAPPER
   (needed for create/update)
--------------------------------*/
const mapToBackend = (data: Partial<Hackathon>) => ({
  event_name: data.eventName,
  description: data.description,
  organizer_id: data.organizerId,
  location: data.location,

  mode: data.mode,
  participation_type: data.participationType,

  min_team_size: data.minTeamSize,
  max_team_size: data.maxTeamSize,

  deadline: data.deadline,
  start_date: data.startDate,
  end_date: data.endDate,

  entry_fee: data.entryFee,
  max_participants: data.maxParticipants,

  image_url: data.imageUrl,
  tags: data.tags,
  requirements: data.requirements,
  prizes: data.prizes,
});

export const hackathonService = {
  // -----------------------
  // LIST
  // -----------------------
  async getAll(
    params: HackathonListParams = {}
  ): Promise<HackathonListResponse> {
    const res = await hackathonApi.getAll(params);

    return {
      ...res,
      results: res.results.map(mapHackathon),
    };
  },

  // -----------------------
  // DETAILS
  // -----------------------
  async getById(id: string): Promise<Hackathon> {
    const data = await hackathonApi.getById(id);
    return mapHackathon(data);
  },

  // -----------------------
  // CREATE
  // -----------------------
  async create(data: any): Promise<Hackathon> {
  const res = await hackathonApi.create(data);
  return mapHackathon(res);
},

  // -----------------------
  // UPDATE
  // -----------------------
  async update(id: string, data: Partial<Hackathon>) {
    const updated = await hackathonApi.update(id, data);
    return mapHackathon(updated); // 👈 normalize immediately
  },

  // -----------------------
  // DELETE
  // -----------------------
  delete(id: string) {
    return hackathonApi.delete(id);
  },

  // -----------------------
  // INTEREST (increment / decrement)
  // -----------------------
  toggleInterest(id: string) {
    return hackathonApi.toggleInterest(id);
  }

};
