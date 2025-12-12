import { Hackathon, User, UserAnalytics, AdminAnalytics, Notification, HackathonRegistration, ParticipationRecord } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  role: 'user',
  createdAt: '2024-01-15',
};

export const mockOrganizerUser: User = {
  id: '2',
  email: 'admin@hackhub.com',
  name: 'Admin User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  role: 'organizer',
  createdAt: '2024-01-01',
};

export const mockHackathons: Hackathon[] = [
  {
    id: '1',
    name: 'TechCrunch Disrupt Hackathon 2024',
    description: 'Join the most prestigious hackathon in the tech industry. Build innovative solutions that could change the world.',
    organizer: 'TechCrunch',
    organizerId: 'org1',
    location: 'San Francisco, CA',
    mode: 'hybrid',
    teamSize: { min: 2, max: 5 },
    deadline: '2024-03-15',
    startDate: '2024-03-20',
    endDate: '2024-03-22',
    postedOn: '2024-02-01',
    tags: ['AI/ML', 'Web3', 'FinTech', 'Healthcare'],
    entryFee: 50,
    prizes: ['$10,000 Grand Prize', '$5,000 Runner-up', '$2,500 Third Place'],
    requirements: ['Valid student ID or employment proof', 'Team registration required'],
    participationType: 'team',
    maxParticipants: 500,
    registeredCount: 245,
    interestedCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    status: 'upcoming',
  },
  {
    id: '2',
    name: 'Google Cloud DevFest',
    description: 'Build with Google Cloud and compete for amazing prizes. Learn from experts and network with developers worldwide.',
    organizer: 'Google Developer Groups',
    organizerId: 'org2',
    location: 'Online',
    mode: 'online',
    teamSize: { min: 1, max: 4 },
    deadline: '2024-04-01',
    startDate: '2024-04-05',
    endDate: '2024-04-07',
    postedOn: '2024-02-15',
    tags: ['Cloud', 'DevOps', 'AI/ML'],
    prizes: ['$5,000 + Cloud Credits', '$3,000 + Cloud Credits'],
    participationType: 'team',
    registeredCount: 1200,
    interestedCount: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'Sustainability Hack',
    description: 'Create solutions for environmental challenges. Focus on sustainability, renewable energy, and climate tech.',
    organizer: 'GreenTech Foundation',
    organizerId: 'org3',
    location: 'New York, NY',
    mode: 'offline',
    teamSize: { min: 3, max: 6 },
    deadline: '2024-03-25',
    startDate: '2024-04-10',
    endDate: '2024-04-12',
    postedOn: '2024-02-20',
    tags: ['Sustainability', 'CleanTech', 'IoT'],
    entryFee: 25,
    prizes: ['$8,000 Grand Prize', 'Incubator Program Access'],
    requirements: ['Focus on environmental impact'],
    participationType: 'team',
    maxParticipants: 200,
    registeredCount: 89,
    interestedCount: 450,
    imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800',
    status: 'upcoming',
  },
  {
    id: '4',
    name: 'Individual Code Challenge',
    description: 'Solo coding competition to test your algorithmic skills and problem-solving abilities.',
    organizer: 'CodeMasters',
    organizerId: 'org4',
    location: 'Online',
    mode: 'online',
    teamSize: { min: 1, max: 1 },
    deadline: '2024-03-10',
    startDate: '2024-03-12',
    endDate: '2024-03-12',
    postedOn: '2024-02-25',
    tags: ['Algorithms', 'Data Structures', 'Competitive Programming'],
    prizes: ['$2,000', '$1,000', '$500'],
    participationType: 'individual',
    registeredCount: 567,
    interestedCount: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    status: 'ongoing',
  },
  {
    id: '5',
    name: 'Blockchain Innovation Summit',
    description: 'Build the future of decentralized applications. Web3, DeFi, and NFT projects welcome.',
    organizer: 'Ethereum Foundation',
    organizerId: 'org5',
    location: 'Miami, FL',
    mode: 'hybrid',
    teamSize: { min: 2, max: 4 },
    deadline: '2024-05-01',
    startDate: '2024-05-10',
    endDate: '2024-05-12',
    postedOn: '2024-03-01',
    tags: ['Web3', 'DeFi', 'NFT', 'Blockchain'],
    entryFee: 75,
    prizes: ['$15,000 + ETH', '$7,500 + ETH', '$3,000 + ETH'],
    participationType: 'team',
    maxParticipants: 300,
    registeredCount: 156,
    interestedCount: 780,
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    status: 'upcoming',
  },
];

export const mockUserAnalytics: UserAnalytics = {
  totalRegistered: 12,
  wins: 3,
  runnerUp: 4,
  losses: 5,
  participationHistory: [
    { hackathonId: '1', hackathonName: 'TechCrunch 2023', date: '2023-09-15', result: 'win', position: 1, teamName: 'CodeCrafters' },
    { hackathonId: '2', hackathonName: 'Google DevFest 2023', date: '2023-10-20', result: 'runner-up', position: 2, teamName: 'ByteBuilders' },
    { hackathonId: '3', hackathonName: 'MLH Local Hack Day', date: '2023-11-05', result: 'loss', teamName: 'DataDynamos' },
    { hackathonId: '4', hackathonName: 'HackMIT', date: '2023-11-18', result: 'win', position: 1, teamName: 'CodeCrafters' },
    { hackathonId: '5', hackathonName: 'PennApps', date: '2023-12-02', result: 'runner-up', position: 3, teamName: 'InnovatorsUnited' },
  ],
};

export const mockAdminAnalytics: AdminAnalytics = {
  totalHackathons: 8,
  averageTeamsPerHackathon: 156,
  totalParticipants: 2450,
  totalBookingAmount: 125000,
  hackathonStats: [
    { hackathonId: '1', hackathonName: 'TechCrunch Disrupt 2024', registeredTeams: 245, totalParticipants: 890, bookingAmount: 24500 },
    { hackathonId: '2', hackathonName: 'Cloud DevFest', registeredTeams: 320, totalParticipants: 1200, bookingAmount: 32000 },
    { hackathonId: '3', hackathonName: 'Sustainability Hack', registeredTeams: 89, totalParticipants: 360, bookingAmount: 8900 },
  ],
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Hackathon Near You!',
    message: 'TechCrunch Disrupt is happening 5 miles away from your location.',
    type: 'nearby',
    hackathonId: '1',
    distance: 5,
    read: false,
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Registration Deadline',
    message: 'Only 3 days left to register for Google Cloud DevFest!',
    type: 'deadline',
    hackathonId: '2',
    read: false,
    createdAt: '2024-03-28T09:00:00Z',
  },
  {
    id: '3',
    title: 'New Hackathon Added',
    message: 'Blockchain Innovation Summit has been added. Check it out!',
    type: 'update',
    hackathonId: '5',
    read: true,
    createdAt: '2024-03-01T14:30:00Z',
  },
  {
    id: '4',
    title: 'Nearby Event Alert',
    message: 'Sustainability Hack is happening 12 miles from you in New York.',
    type: 'nearby',
    hackathonId: '3',
    distance: 12,
    read: false,
    createdAt: '2024-02-28T16:00:00Z',
  },
];

export const mockRegistrations: HackathonRegistration[] = [
  {
    id: 'reg1',
    hackathonId: '1',
    userId: '1',
    teamName: 'CodeCrafters',
    teamMembers: [
      { name: 'John Doe', email: 'john@example.com', role: 'Team Lead' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'Backend Developer' },
      { name: 'Bob Wilson', email: 'bob@example.com', role: 'Frontend Developer' },
    ],
    contactEmail: 'john@example.com',
    contactPhone: '+1-555-0123',
    status: 'approved',
    registeredAt: '2024-02-15T10:30:00Z',
  },
  {
    id: 'reg2',
    hackathonId: '1',
    userId: '3',
    teamName: 'ByteBuilders',
    teamMembers: [
      { name: 'Alice Brown', email: 'alice@example.com', role: 'Team Lead' },
      { name: 'Charlie Davis', email: 'charlie@example.com', role: 'Full Stack' },
    ],
    contactEmail: 'alice@example.com',
    contactPhone: '+1-555-0456',
    status: 'pending',
    registeredAt: '2024-02-18T14:00:00Z',
  },
];

export const availableTags = [
  'AI/ML', 'Web3', 'FinTech', 'Healthcare', 'Cloud', 'DevOps',
  'Sustainability', 'CleanTech', 'IoT', 'Blockchain', 'DeFi', 'NFT',
  'Algorithms', 'Data Structures', 'Mobile', 'AR/VR', 'Gaming', 'EdTech',
];

// Mock Teams Data
export const mockTeams: import('@/types').Team[] = [
  {
    id: 'team1',
    name: 'CodeCrafters',
    code: 'CC2024',
    description: 'A passionate team of full-stack developers focused on building innovative solutions.',
    ownerId: '1',
    ownerName: 'John Doe',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', role: 'Team Lead', joinedAt: '2024-01-15' },
      { id: '3', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', role: 'Backend Developer', joinedAt: '2024-01-20' },
      { id: '4', name: 'Bob Wilson', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', role: 'Frontend Developer', joinedAt: '2024-01-25' },
    ],
    isPublic: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'team2',
    name: 'ByteBuilders',
    code: 'BB2024',
    description: 'Building the future one byte at a time. Specializing in cloud and DevOps.',
    ownerId: '5',
    ownerName: 'Alice Brown',
    members: [
      { id: '5', name: 'Alice Brown', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', role: 'Team Lead', joinedAt: '2024-02-01' },
      { id: '6', name: 'Charlie Davis', email: 'charlie@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', role: 'Full Stack', joinedAt: '2024-02-05' },
    ],
    isPublic: true,
    createdAt: '2024-02-01',
  },
  {
    id: 'team3',
    name: 'DataDynamos',
    code: 'DD2024',
    description: 'Data science and ML enthusiasts tackling complex problems with AI.',
    ownerId: '7',
    ownerName: 'Eva Martinez',
    members: [
      { id: '7', name: 'Eva Martinez', email: 'eva@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eva', role: 'Team Lead', joinedAt: '2024-02-10' },
      { id: '8', name: 'Frank Lee', email: 'frank@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank', role: 'ML Engineer', joinedAt: '2024-02-15' },
      { id: '9', name: 'Grace Kim', email: 'grace@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', role: 'Data Analyst', joinedAt: '2024-02-20' },
      { id: '10', name: 'Henry Wang', email: 'henry@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry', role: 'Backend Developer', joinedAt: '2024-02-25' },
    ],
    isPublic: true,
    createdAt: '2024-02-10',
  },
  {
    id: 'team4',
    name: 'InnovatorsUnited',
    code: 'IU2024',
    description: 'A diverse team bringing fresh perspectives to hackathon challenges.',
    ownerId: '11',
    ownerName: 'Ivy Chen',
    members: [
      { id: '11', name: 'Ivy Chen', email: 'ivy@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy', role: 'Team Lead', joinedAt: '2024-03-01' },
      { id: '12', name: 'Jack Thompson', email: 'jack@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', role: 'Designer', joinedAt: '2024-03-05' },
    ],
    isPublic: false,
    createdAt: '2024-03-01',
  },
];

// Mock User Credits
export const mockUserCredits: import('@/types').UserCredits = {
  balance: 250,
  transactions: [
    { id: 'tx1', type: 'deposit', amount: 100, description: 'Initial deposit', createdAt: '2024-01-15T10:00:00Z' },
    { id: 'tx2', type: 'deduction', amount: 50, description: 'TechCrunch Hackathon registration', createdAt: '2024-02-01T14:30:00Z' },
    { id: 'tx3', type: 'deposit', amount: 200, description: 'Credit pack purchase', createdAt: '2024-02-15T09:00:00Z' },
    { id: 'tx4', type: 'refund', amount: 25, description: 'Sustainability Hack cancellation refund', createdAt: '2024-02-20T16:00:00Z' },
    { id: 'tx5', type: 'deduction', amount: 25, description: 'Individual Code Challenge registration', createdAt: '2024-03-01T11:00:00Z' },
  ],
};


// hackthon winners data
export const mockSubmissions = [
  {
    id: "proj1",
    hackathonId: "1",
    teamId: "reg1",
    projectTitle: "AI Health Scanner",
    projectDesc: "A tool that predicts diseases from X-rays using CNN.",
    githubUrl: "https://github.com/codecrafters/healthscan",
    liveUrl: "https://healthscan.live",
    score: 95

  },
  {
    id: "proj2",
    hackathonId: "1",
    teamId: "reg2",
    projectTitle: "EcoRoute Planner",
    projectDesc: "A real-time green route planner using pollution datasets.",
    githubUrl: "https://github.com/bytebuilders/ecoroute",
    liveUrl: "https://ecoroute.io",
    score: 81
  }
];


export const mockWinners = [
  {
    id: "win1",
    projectId: "proj1",
    position: 1
  },
  {
    id: "win2",
    projectId: "proj2",
    position: 2
  }
];


