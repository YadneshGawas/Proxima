/**
 * API Service Layer
 * 
 * This file contains all API calls to connect with your Flask/MySQL backend.
 * Replace the BASE_URL with your Flask server URL and update the endpoints accordingly.
 * 
 * Mock implementations are provided for development - replace with actual fetch calls.
 */

import { 
  User, 
  Hackathon, 
  HackathonRegistration, 
  UserAnalytics, 
  AdminAnalytics, 
  Notification,
  HackathonFilters 
} from '@/types';
import { 
  mockUser, 
  mockOrganizerUser,
  mockHackathons, 
  mockUserAnalytics, 
  mockAdminAnalytics, 
  mockNotifications,
  mockRegistrations 
} from '@/data/mockData';

// TODO: Replace with your Flask backend URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// ============ AUTH SERVICES ============

export const authService = {
  // Login with email/password
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // TODO: Replace with actual API call
    // return apiCall('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    // });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    const isOrganizer = email.includes('admin') || email.includes('organizer');
    return { 
      user: isOrganizer ? mockOrganizerUser : mockUser, 
      token: 'mock-jwt-token' 
    };
  },

  // Register new user
  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    // TODO: Replace with actual API call
    // return apiCall('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify({ name, email, password }),
    // });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return { 
      user: { ...mockUser, name, email }, 
      token: 'mock-jwt-token' 
    };
  },

  // Google OAuth
  loginWithGoogle: async (token: string): Promise<{ user: User; token: string }> => {
    // TODO: Replace with actual API call
    // return apiCall('/auth/google', {
    //   method: 'POST',
    //   body: JSON.stringify({ token }),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return { user: mockUser, token: 'mock-jwt-token' };
  },

  // Facebook OAuth
  loginWithFacebook: async (token: string): Promise<{ user: User; token: string }> => {
    // TODO: Replace with actual API call
    // return apiCall('/auth/facebook', {
    //   method: 'POST',
    //   body: JSON.stringify({ token }),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return { user: mockUser, token: 'mock-jwt-token' };
  },

  // Logout
  logout: async (): Promise<void> => {
    // TODO: Replace with actual API call
    // return apiCall('/auth/logout', { method: 'POST' });
    
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    // TODO: Replace with actual API call
    // return apiCall('/auth/me');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUser;
  },

  // Convert user to organizer
  becomeOrganizer: async (userId: string): Promise<User> => {
    // TODO: Replace with actual API call
    // return apiCall(`/users/${userId}/become-organizer`, { method: 'POST' });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockUser, role: 'organizer' };
  },
};

// ============ HACKATHON SERVICES ============

export const hackathonService = {
  // Get all hackathons with optional filters
  getAll: async (filters?: HackathonFilters): Promise<Hackathon[]> => {
    // TODO: Replace with actual API call
    // const params = new URLSearchParams(filters as any).toString();
    // return apiCall(`/hackathons?${params}`);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    let filtered = [...mockHackathons];
    
    if (filters?.mode) {
      filtered = filtered.filter(h => h.mode === filters.mode);
    }
    if (filters?.participationType) {
      filtered = filtered.filter(h => h.participationType === filters.participationType);
    }
    if (filters?.tags?.length) {
      filtered = filtered.filter(h => 
        h.tags.some(tag => filters.tags?.includes(tag))
      );
    }
    
    return filtered;
  },

  // Get hackathon by ID
  getById: async (id: string): Promise<Hackathon> => {
    // TODO: Replace with actual API call
    // return apiCall(`/hackathons/${id}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const hackathon = mockHackathons.find(h => h.id === id);
    if (!hackathon) throw new Error('Hackathon not found');
    return hackathon;
  },

  // Get nearby hackathons based on location
  getNearby: async (lat: number, lng: number, radius: number = 50): Promise<Hackathon[]> => {
    // TODO: Replace with actual API call
    // return apiCall(`/hackathons/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockHackathons.filter(h => h.mode === 'offline' || h.mode === 'hybrid');
  },

  // Create new hackathon (Admin)
  create: async (hackathon: Omit<Hackathon, 'id' | 'registeredCount' | 'interestedCount' | 'status'>): Promise<Hackathon> => {
    // TODO: Replace with actual API call
    // return apiCall('/hackathons', {
    //   method: 'POST',
    //   body: JSON.stringify(hackathon),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...hackathon,
      id: String(Date.now()),
      registeredCount: 0,
      interestedCount: 0,
      status: 'upcoming',
    };
  },

  // Update hackathon (Admin)
  update: async (id: string, hackathon: Partial<Hackathon>): Promise<Hackathon> => {
    // TODO: Replace with actual API call
    // return apiCall(`/hackathons/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(hackathon),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockHackathons.find(h => h.id === id);
    if (!existing) throw new Error('Hackathon not found');
    return { ...existing, ...hackathon };
  },

  // Delete hackathon (Admin)
  delete: async (id: string): Promise<void> => {
    // TODO: Replace with actual API call
    // return apiCall(`/hackathons/${id}`, { method: 'DELETE' });
    
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  // Mark hackathon as interested
  markInterested: async (hackathonId: string, userId: string): Promise<void> => {
    // TODO: Replace with actual API call
    // return apiCall(`/hackathons/${hackathonId}/interested`, { method: 'POST' });
    
    await new Promise(resolve => setTimeout(resolve, 200));
  },
};

// ============ REGISTRATION SERVICES ============

export const registrationService = {
  // Register for hackathon
  register: async (registration: Omit<HackathonRegistration, 'id' | 'status' | 'registeredAt'>): Promise<HackathonRegistration> => {
    // TODO: Replace with actual API call
    // return apiCall('/registrations', {
    //   method: 'POST',
    //   body: JSON.stringify(registration),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...registration,
      id: String(Date.now()),
      status: 'pending',
      registeredAt: new Date().toISOString(),
    };
  },

  // Get registrations for a hackathon (Admin)
  getByHackathon: async (hackathonId: string): Promise<HackathonRegistration[]> => {
    // TODO: Replace with actual API call
    // return apiCall(`/hackathons/${hackathonId}/registrations`);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockRegistrations.filter(r => r.hackathonId === hackathonId);
  },

  // Get user's registrations
  getByUser: async (userId: string): Promise<HackathonRegistration[]> => {
    // TODO: Replace with actual API call
    // return apiCall(`/users/${userId}/registrations`);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockRegistrations.filter(r => r.userId === userId);
  },

  // Update registration status (Admin)
  updateStatus: async (registrationId: string, status: 'approved' | 'rejected'): Promise<HackathonRegistration> => {
    // TODO: Replace with actual API call
    // return apiCall(`/registrations/${registrationId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status }),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const reg = mockRegistrations.find(r => r.id === registrationId);
    if (!reg) throw new Error('Registration not found');
    return { ...reg, status };
  },

  // Delete registration (Admin)
  delete: async (registrationId: string): Promise<void> => {
    // TODO: Replace with actual API call
    // return apiCall(`/registrations/${registrationId}`, { method: 'DELETE' });
    
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};

// ============ ANALYTICS SERVICES ============

export const analyticsService = {
  // Get user analytics
  getUserAnalytics: async (userId: string, filters?: HackathonFilters): Promise<UserAnalytics> => {
    // TODO: Replace with actual API call
    // const params = new URLSearchParams(filters as any).toString();
    // return apiCall(`/users/${userId}/analytics?${params}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUserAnalytics;
  },

  // Get admin analytics
  getAdminAnalytics: async (organizerId: string): Promise<AdminAnalytics> => {
    // TODO: Replace with actual API call
    // return apiCall(`/organizers/${organizerId}/analytics`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAdminAnalytics;
  },
};

// ============ NOTIFICATION SERVICES ============

export const notificationService = {
  // Get user notifications
  getAll: async (userId: string): Promise<Notification[]> => {
    // TODO: Replace with actual API call
    // return apiCall(`/users/${userId}/notifications`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotifications;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    // TODO: Replace with actual API call
    // return apiCall(`/notifications/${notificationId}/read`, { method: 'POST' });
    
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  // Mark all as read
  markAllAsRead: async (userId: string): Promise<void> => {
    // TODO: Replace with actual API call
    // return apiCall(`/users/${userId}/notifications/read-all`, { method: 'POST' });
    
    await new Promise(resolve => setTimeout(resolve, 200));
  },
};

// ============ LOCATION SERVICES ============

export const locationService = {
  // Get current location
  getCurrentLocation: (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};
