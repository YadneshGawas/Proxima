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
import { userAnalyticsService, UserAnalyticsResponse } from "@/services/userAnalytics/userAnalytics.service";

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    try {
      const data = await userAnalyticsService.getMe();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionLabel = (position: number | null) => {
    if (!position) return "Participated";
    const suffix =
      position === 1 ? "st" : position === 2 ? "nd" : position === 3 ? "rd" : "th";
    return `${position}${suffix} Place`;
  };

  const getPositionColor = (position: number | null) => {
    switch (position) {
      case 1:
        return "bg-yellow-100 text-yellow-700";
      case 2:
        return "bg-gray-100 text-gray-700";
      case 3:
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
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
            value={analytics?.total_hackathons || 0}
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
            value={analytics?.runner_up || 0}
            icon={<Medal className="h-5 w-5" />}
            description="Second & third place"
          />
          <AnalyticsCard
            title="Participated"
            value={analytics?.participated || 0}
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
            {analytics?.current_team ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Team Name</span>
                  <span className="font-medium">{analytics.current_team.name}</span>
                </div>
                {analytics.current_team.hackathon_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Hackathon</span>
                    <span className="font-medium">{analytics.current_team.hackathon_id}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default">Active</Badge>
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
              ) : analytics?.recent_participation.length === 0 ? (
                <p className="text-muted-foreground">
                  No participation history yet.
                </p>
              ) : (
                analytics?.recent_participation.map((record) => (
                  <div
                    key={record.hackathon_id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {record.hackathon_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Team: {record.team_name} • {new Date(record.participated_at).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge className={getPositionColor(record.position)}>
                      {getPositionLabel(record.position)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
