import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/routes/ProtectedRoute";


// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/user/Dashboard";
import Hackathons from "./pages/user/Hackathons";
import HackathonDetail from "./pages/user/HackathonDetail";
import HackathonWinners from "./pages/user/HackathonWinners";
import Analytics from "./pages/user/Analytics";
import Contact from "./pages/user/Contact";
import Teams from "./pages/user/Teams";
import TeamDetail from "./pages/user/TeamDetail";
import Credits from "./pages/user/Credits";
import CreateEvent from "./pages/admin/CreateEvent";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import EventDetails from "./pages/admin/EventDetails";
import NotFound from "./pages/NotFound";
import ProjectSubmission from "./pages/admin/ProjectSubmission";
import ReviewSubmissionPage from "./pages/admin/ReviewSubmissionPage";
import ProjectExplorer from "./pages/user/ProjectExplorer"
import CreateTeam from "./pages/user/TeamsCreate";
import SubmissionDetail from "./pages/user/SubmissionDetail";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Routes */}
              <Route element={<ProtectedRoute/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/hackathons" element={<Hackathons />} />
              <Route path="/hackathons/:id" element={<HackathonDetail />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/hackathons/:id/HackathonWinners" element={<HackathonWinners />} />
              <Route path="/projects" element={<ProjectExplorer />} />
              <Route path="/teams/create" element={<CreateTeam />} />

              
              
              {/* Admin Routes */}
              <Route path="/admin/create-event" element={<CreateEvent />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/events/:id" element={<EventDetails />} />
              <Route path="/admin/:id/submission" element={<ProjectSubmission />} />
              <Route path="/admin/:hackathonId/submission/:submissionId" element={<ReviewSubmissionPage />} />
              <Route path="/hackathons/:hackathonId/submission/:submissionId" element={<SubmissionDetail />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
