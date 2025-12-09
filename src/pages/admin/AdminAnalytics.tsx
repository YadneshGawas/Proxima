import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService } from '@/services/api';
import { AdminAnalytics as AdminAnalyticsType } from '@/types';

export default function AdminAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AdminAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    try {
      const data = await analyticsService.getAdminAnalytics(user.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const barData = analytics?.hackathonStats.map((stat) => ({
    name: stat.hackathonName.slice(0, 15) + '...',
    teams: stat.registeredTeams,
    participants: stat.totalParticipants,
  })) || [];

  const trendData = [
    { month: 'Jan', hackathons: 2, participants: 450 },
    { month: 'Feb', hackathons: 3, participants: 680 },
    { month: 'Mar', hackathons: 2, participants: 520 },
    { month: 'Apr', hackathons: 4, participants: 890 },
    { month: 'May', hackathons: 3, participants: 750 },
    { month: 'Jun', hackathons: 5, participants: 1200 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Analytics</h1>
          <p className="text-muted-foreground">
            Overview of your hackathon events and performance.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            title="Total Hackathons"
            value={analytics?.totalHackathons || 0}
            icon={<Calendar className="h-5 w-5" />}
            description="Events created"
            trend={{ value: 15, isPositive: true }}
          />
          <AnalyticsCard
            title="Avg Teams/Event"
            value={analytics?.averageTeamsPerHackathon || 0}
            icon={<TrendingUp className="h-5 w-5" />}
            description="Average registrations"
          />
          <AnalyticsCard
            title="Total Participants"
            value={analytics?.totalParticipants.toLocaleString() || '0'}
            icon={<Users className="h-5 w-5" />}
            description="All-time participants"
          />
          <AnalyticsCard
            title="Total Bookings"
            value={`$${analytics?.totalBookingAmount.toLocaleString() || '0'}`}
            icon={<DollarSign className="h-5 w-5" />}
            description="Revenue generated"
            trend={{ value: 22, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Registrations by Event */}
          <Card>
            <CardHeader>
              <CardTitle>Registrations by Event</CardTitle>
              <CardDescription>Teams and participants per hackathon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="teams" name="Teams" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="participants" name="Participants" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Trend</CardTitle>
              <CardDescription>Monthly hackathons and participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="hackathons"
                      name="Hackathons"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="participants"
                      name="Participants"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
            <CardDescription>Detailed breakdown by hackathon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Event Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Teams
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Participants
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.hackathonStats.map((stat) => (
                    <tr key={stat.hackathonId} className="border-b border-border">
                      <td className="px-4 py-3 text-sm text-foreground font-medium">
                        {stat.hackathonName}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {stat.registeredTeams}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {stat.totalParticipants}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        ${stat.bookingAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/events/${stat.hackathonId}`)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
