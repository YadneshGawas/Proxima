import { hackathonService } from "@/services/hackathon/hackathon.service";

export async function refreshHackathonStatusOncePerDay(
  hackathonId: string
) {
  const key = `hackathon-status-refresh:${hackathonId}`;
  const today = new Date().toISOString().split("T")[0];

  const lastRun = localStorage.getItem(key);
  if (lastRun === today) return;

  try {
    await hackathonService.refreshStatus(hackathonId);
    localStorage.setItem(key, today);
  } catch (err) {
    console.warn("Status refresh skipped:", err);
  }
}