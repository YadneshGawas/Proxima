/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Calendar, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/api";
import { UserAnalytics } from "@/types";
import { mockTeams } from "@/data/mockData"; // to resolve teamId → name

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // USER’S CURRENT TEAM (global team)
  const userTeam = mockTeams.find((team) =>
    team.members?.some((m) => m.userId === user?.id)
  );

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    try {
      const data = await analyticsService.getUserAnalytics(user.id);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "bg-primary text-primary-foreground";
      case "runner-up":
      case "second-runner-up":
        return "bg-secondary text-secondary-foreground";
      case "loss":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-accent text-accent-foreground";
    }
  };

  const getResultLabel = (record: any) => {
    if (record.result === "win" && record.position) {
      const pos = record.position;
      const suffix =
        pos === 1 ? "st" : pos === 2 ? "nd" : pos === 3 ? "rd" : "th";
      return `${pos}${suffix} Place`;
    }
    if (record.result === "runner-up") return "Runner-up";
    if (record.result === "second-runner-up") return "Second Runner-up";
    return record.result.charAt(0).toUpperCase() + record.result.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your hackathon journey.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            title="Total Hackathons"
            value={analytics?.totalRegistered || 0}
            icon={<Calendar className="h-5 w-5" />}
            description="Registered hackathons"
          />
          <AnalyticsCard
            title="Wins"
            value={analytics?.wins || 0}
            icon={<Trophy className="h-5 w-5" />}
            description="First place finishes"
          />
          <AnalyticsCard
            title="Runner-up"
            value={analytics?.runnerUp || 0}
            icon={<Medal className="h-5 w-5" />}
            description="Second & third place"
          />
          <AnalyticsCard
            title="Participated"
            value={analytics?.losses || 0}
            icon={<Award className="h-5 w-5" />}
            description="Other participations"
          />
        </div>

        {/* CURRENT TEAM CARD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Team
            </CardTitle>
            <CardDescription>Your active team information</CardDescription>
          </CardHeader>
          <CardContent>
            {userTeam ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Team Name</span>
                  <span className="font-medium">{userTeam.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium">
                    {userTeam.members?.length} / (no max defined)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Since</span>
                  <span className="font-medium">
                    {new Date(userTeam.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Rank</span>
                  <Badge variant="default">N/A</Badge>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                You are not part of any team.
              </p>
            )}
          </CardContent>
        </Card>

        {/* RECENT PARTICIPATION */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Participation</CardTitle>
            <CardDescription>Your latest hackathon activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : analytics?.participationHistory.length === 0 ? (
                <p className="text-muted-foreground">
                  No participation history yet.
                </p>
              ) : (
                analytics?.participationHistory
                  .slice(0, 5)
                  .map((record, index) => {
                    const teamName = mockTeams.find(
                      (t) => t.id === record.teamId
                    )?.name;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {record.hackathonName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {teamName ? `Team: ${teamName} • ` : ""}
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>

                        <Badge className={getResultColor(record.result)}>
                          {getResultLabel(record)}
                        </Badge>
                      </div>
                    );
                  })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
