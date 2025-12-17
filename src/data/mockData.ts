import {
  User,
  Hackathon,
  Registration,
  GlobalTeam,
  HackathonTeam,
  Winner,
  Payment,
  Notification,
  UserCredits,
  UserAnalytics,
  AdminAnalytics,
} from "@/types";

// ========================================================
// USERS
// ========================================================
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    code: "USR001",
    createdAt: "2024-01-10T10:00:00Z",
    credits: 200,
    role: "user",
  },
  {
    id: "u2",
    name: "Admin User",
    email: "admin@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    code: "USR002",
    createdAt: "2024-01-01T09:00:00Z",
    credits: 500,
    role: "organizer",
  },
  {
    id: "u3",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    code: "USR003",
    createdAt: "2024-01-05T11:00:00Z",
    credits: 120,
    role: "user",
  },
  {
    id: "u4",
    name: "Bob Wilson",
    email: "bob@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    code: "USR004",
    createdAt: "2024-01-06T11:00:00Z",
    credits: 50,
    role: "user",
  },
];

// ========================================================
// HACKATHONS (8 total)
// ========================================================
export const mockHackathons: Hackathon[] = [
  {
    id: "h1",
    organizerId: "u2",
    eventName: "TechCrunch Disrupt 2024",
    description: "Build world-changing solutions with top tech innovators.",
    location: "San Francisco, CA",
    mode: "hybrid",
    participationType: "team",
    minTeamSize: 2,
    maxTeamSize: 5,
    deadline: "2024-03-10T23:59:00Z",
    startDate: "2024-03-20T09:00:00Z",
    endDate: "2024-03-22T18:00:00Z",
    entryFee: 50,
    maxParticipants: 500,
    createdAt: "2024-02-01T10:00:00Z",
    registeredCount: 245,
    interestedCount: 890,
    status: "upcoming",
    tags: ["AI/ML", "Cloud"],
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
  },
  {
    id: "h2",
    organizerId: "u2",
    eventName: "Google Cloud DevFest",
    description: "Compete and learn with Google Cloud experts.",
    location: "Online",
    mode: "online",
    participationType: "team",
    minTeamSize: 1,
    maxTeamSize: 4,
    deadline: "2024-04-01T23:59:00Z",
    startDate: "2024-04-05T09:00:00Z",
    endDate: "2024-04-07T18:00:00Z",
    entryFee: 0,
    createdAt: "2024-02-10T12:00:00Z",
    registeredCount: 1200,
    interestedCount: 3500,
    status: "upcoming",
    tags: ["Cloud", "DevOps"],
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
  },
  {
    id: "h3",
    organizerId: "u3",
    eventName: "Sustainability Hack",
    description: "Environmental & Climate Tech solutions.",
    location: "New York, NY",
    mode: "offline",
    participationType: "team",
    minTeamSize: 3,
    maxTeamSize: 6,
    deadline: "2024-03-25T23:59:00Z",
    startDate: "2024-04-10T09:00:00Z",
    endDate: "2024-04-12T18:00:00Z",
    entryFee: 25,
    maxParticipants: 200,
    createdAt: "2024-02-20T11:00:00Z",
    registeredCount: 89,
    interestedCount: 450,
    status: "upcoming",
    tags: ["CleanTech", "IoT"],
    imageUrl: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800",
  },
  {
    id: "h4",
    organizerId: "u4",
    eventName: "Individual Code Challenge",
    description: "Test your algorithmic skills.",
    location: "Online",
    mode: "online",
    participationType: "individual",
    minTeamSize: 1,
    maxTeamSize: 1,
    deadline: "2024-03-10T23:59:00Z",
    startDate: "2024-03-12T09:00:00Z",
    endDate: "2024-03-12T18:00:00Z",
    entryFee: 0,
    createdAt: "2024-02-25T12:00:00Z",
    registeredCount: 567,
    interestedCount: 1200,
    status: "ongoing",
    tags: ["Algorithms", "Data Structures"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
  },

  // Minimal hackathons
  {
    id: "h5",
    organizerId: "u1",
    eventName: "Blockchain Innovation Summit",
    mode: "hybrid",
    participationType: "team",
    entryFee: 75,
    createdAt: "2024-03-01T09:00:00Z",
  },
  {
    id: "h6",
    organizerId: "u2",
    eventName: "AI Mini Sprint",
    mode: "online",
    participationType: "team",
    entryFee: 0,
    createdAt: "2024-03-03T09:00:00Z",
  },
  {
    id: "h7",
    organizerId: "u1",
    eventName: "Cybersecurity CTF",
    mode: "offline",
    participationType: "individual",
    entryFee: 10,
    createdAt: "2024-03-04T10:00:00Z",
  },
  {
    id: "h8",
    organizerId: "u3",
    eventName: "Robotics Weekend Jam",
    mode: "hybrid",
    participationType: "team",
    entryFee: 20,
    createdAt: "2024-03-05T10:00:00Z",
  },
];

// ========================================================
// GLOBAL TEAMS
// ========================================================
export const mockTeams: GlobalTeam[] = [
  {
    id: "t1",
    name: "CodeCrafters",
    description: "A passionate engineering team.",
    ownerId: "u1",
    teamCode: "CC2024",
    isPublic: true,
    createdAt: "2024-01-15T10:00:00Z",
    members: [
      {
        id: "gtm1",
        teamId: "t1",
        userId: "u1",
        role: "leader",
        joinedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "gtm2",
        teamId: "t1",
        userId: "u3",
        role: "backend",
        joinedAt: "2024-01-20T10:00:00Z",
      },
      {
        id: "gtm3",
        teamId: "t1",
        userId: "u4",
        role: "frontend",
        joinedAt: "2024-01-20T10:30:00Z",
      },
    ],
  },
];

// ========================================================
// HACKATHON TEAMS
// ========================================================
export const mockHackathonTeams: HackathonTeam[] = [
  {
    id: "ht1",
    hackathonId: "h1",
    name: "CodeCrafters-H1",
    createdById: "u1",
    createdAt: "2024-02-12T10:00:00Z",
    members: [
      {
        id: "htm1",
        hackathonTeamId: "ht1",
        userId: "u1",
        joinedAt: "2024-02-12T10:00:00Z",
      },
      {
        id: "htm2",
        hackathonTeamId: "ht1",
        userId: "u3",
        joinedAt: "2024-02-12T10:05:00Z",
      },
    ],
  },
];

// ========================================================
// REGISTRATIONS
// ========================================================
export const mockRegistrations: Registration[] = [
  {
    id: "reg1",
    hackathonId: "h1",
    globalTeamId: "t1",
    registeredAt: "2024-02-15T10:30:00Z",
    status: 1,
  },
  {
    id: "reg2",
    hackathonId: "h4",
    userId: "u1",
    registeredAt: "2024-02-18T14:00:00Z",
    status: 0,
  },
  {
    id: "reg3",
    hackathonId: "h1",
    hackathonTeamId: "ht1",
    registeredAt: "2024-02-16T09:00:00Z",
    status: 1,
  },
];

// ========================================================
// PAYMENTS
// ========================================================
export const mockPayments: Payment[] = [
  {
    id: "pay1",
    userId: "u1",
    hackathonId: "h1",
    amount: 50,
    currency: "USD",
    status: "completed",
    createdAt: "2024-02-15T10:31:00Z",
  },
];

// ========================================================
// WINNERS
// ========================================================
export const mockWinners: Winner[] = [
  {
    id: "win1",
    hackathonId: "h1",
    hackathonTeamId: "ht1",
    position: 1,
    projectTitle: "AI Health Scanner",
    projectDesc: "Automated diagnosis from X-rays using CNN.",
    gitUrl: "https://github.com/codecrafters/healthscan",
    liveUrl: "https://healthscan.live",
    createdAt: "2024-03-01T10:00:00Z",
  },
];

// ========================================================
// USER CREDITS
// ========================================================
export const mockUserCredits: UserCredits = {
  balance: 250,
  transactions: [
    {
      id: "tx1",
      type: "deposit",
      amount: 100,
      description: "Initial deposit",
      createdAt: "2024-01-12T10:00:00Z",
    },
    {
      id: "tx2",
      type: "deduction",
      amount: 50,
      description: "TechCrunch registration",
      createdAt: "2024-02-15T10:00:00Z",
    },
  ],
};

// ========================================================
// NOTIFICATIONS
// ========================================================
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Hackathon Near You!",
    message: "TechCrunch Disrupt is only 5 miles away.",
    type: "nearby",
    hackathonId: "h1",
    distance: 5,
    read: false,
    createdAt: "2024-03-01T10:00:00Z",
  },
];

// ========================================================
// ANALYTICS
// ========================================================
export const mockUserAnalytics: UserAnalytics = {
  totalRegistered: 5,
  wins: 1,
  runnerUp: 1,
  losses: 3,
  participationHistory: [
    {
      hackathonId: "h1",
      hackathonName: "TechCrunch Disrupt",
      date: "2023-09-15",
      result: "win",
      position: 1,
      teamId: "t1",
    },
  ],
};

export const mockAdminAnalytics: AdminAnalytics = {
  totalHackathons: 8,
  averageTeamsPerHackathon: 30,
  totalParticipants: 2500,
  totalBookingAmount: 125000,
  hackathonStats: [
    {
      hackathonId: "h1",
      hackathonName: "TechCrunch Disrupt",
      registeredTeams: 245,
      totalParticipants: 890,
      bookingAmount: 24500,
    },
  ],
};

// ========================================================
// AVAILABLE TAGS (used in CreateEvent and filters)
// ========================================================
export const availableTags: string[] = [
  "AI/ML",
  "Cloud",
  "IoT",
  "Blockchain",
  "Cybersecurity",
  "Web",
  "Mobile",
  "AR/VR",
  "Robotics",
  "DevOps",
  "Data Science",
];

// ========================================================
// SUBMISSIONS (REQUIRED FOR SUBMISSION LIST PAGE)
// ========================================================
export const mockSubmissions = [
  {
    id: "sub1",
    hackathonId: "h1",
    registrationId: "reg1",
    projectTitle: "AI Health Scanner",
    projectDesc: "ML-based diagnosis tool.",
    githubUrl: "https://github.com/codecrafters/healthscan",
    liveUrl: "https://healthscan.live",
    score: 92,
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "sub2",
    hackathonId: "h1",
    registrationId: "reg3",
    projectTitle: "Team H1 - Robotics Vision",
    projectDesc: "Robot detection pipeline.",
    githubUrl: "https://github.com/demo/robotics",
    liveUrl: "",
    score: null,
    createdAt: "2024-03-01T12:00:00Z",
  },
];
