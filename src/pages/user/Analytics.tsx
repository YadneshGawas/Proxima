/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Calendar, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/api";

import { UserAnalytics, HackathonFilters } from "@/types";

export default function Analytics() {
  // const { user } = useAuth();
  // WARNING
  const user = { id: "1" }; //Demo ID
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<HackathonFilters>({});

  useEffect(() => {
    loadAnalytics();
  }, [user, filters]);

  const loadAnalytics = async () => {
    if (!user) return;
    try {
      const data = await analyticsService.getUserAnalytics(user.id, filters);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ===================== PIE CHART DATA =====================
  const pieData = analytics
    ? [
        {
          name: "Wins",
          value: analytics.wins,
          color: "hsl(var(--chart-1))",
        },
        {
          name: "Runner-up",
          value: analytics.runnerUp,
          color: "hsl(var(--chart-2))",
        },
        {
          name: "Participated",
          value: analytics.losses,
          color: "hsl(var(--chart-3))",
        },
      ]
    : [];

  // ===================== BAR CHART DATA =====================
  const barData =
    analytics?.participationHistory.slice(0, 6).map((record) => ({
      name: record.hackathonName.slice(0, 15) + "...",
      position:
        record.result === "win"
          ? 1
          : record.result === "runner-up"
          ? 2
          : record.result === "second-runner-up"
          ? 3
          : 4, // loss or participated
    })) || [];

  // ===================== BADGE COLORS =====================
  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "bg-primary text-primary-foreground";
      case "runner-up":
        return "bg-secondary text-secondary-foreground";
      case "second-runner-up":
        return "bg-yellow-500 text-black";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Track your hackathon performance and progress.
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter your analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Participation Type */}
              <div className="space-y-2">
                <Label>Hackathon Type</Label>
                <Select
                  value={filters.participationType || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      participationType:
                        value === "all" ? undefined : (value as any),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Start */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.dateRange?.start || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: {
                        ...filters.dateRange,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* Date Range End */}
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.dateRange?.end || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: {
                        ...filters.dateRange,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            title="Total Hackathons"
            value={analytics?.totalRegistered || 0}
            icon={<Calendar className="h-5 w-5" />}
            description="All time registrations"
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
            description="Second/third place"
          />

          <AnalyticsCard
            title="Win Rate"
            value={
              analytics
                ? `${Math.round(
                    (analytics.wins / analytics.totalRegistered) * 100
                  )}%`
                : "0%"
            }
            icon={<TrendingUp className="h-5 w-5" />}
            description="Overall performance"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* PIE CHART */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>
                Breakdown of your hackathon results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* BAR CHART */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>Your last 6 hackathon results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis
                      domain={[1, 4]}
                      ticks={[1, 2, 3, 4]}
                      tickFormatter={(v) =>
                        v === 1
                          ? "1st"
                          : v === 2
                          ? "2nd"
                          : v === 3
                          ? "3rd"
                          : "Participated"
                      }
                    />
                    <Tooltip />
                    <Bar
                      dataKey="position"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PARTICIPATION HISTORY TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Participation History</CardTitle>
            <CardDescription>
              Complete record of your hackathon participation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                      Hackathon
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                      Team ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.participationHistory.map((record, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="px-4 py-3 text-sm">
                        {record.hackathonName}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {record.teamId || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getResultColor(record.result)}>
                          {record.result.replace("-", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
