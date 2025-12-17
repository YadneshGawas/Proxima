import { User } from "@/types";
import { mockUsers } from "@/data/mockData";

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await delay(400);
    const user = mockUsers.find(u => u.email === email) ?? mockUsers[0];
    return {
      user,
      access_token: "mock-jwt-token",
    };
  },

  register: async (name: string, email: string, password: string) => {
    await delay(500);
    return {
      user: {
        id: "mock-id",
        name,
        email,
        role: "user",
      } as User,
      access_token: "mock-jwt-token",
    };
  },

  getCurrentUser: async () => {
    await delay(200);
    return { user: mockUsers[0] };
  },

  logout: async () => {
    localStorage.removeItem("token");
  },
};
