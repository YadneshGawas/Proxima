import { mockAuthApi } from "./auth.mock";
import { realAuthApi } from "./auth.api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === "false";

const api = USE_MOCK ? mockAuthApi : realAuthApi;

console.log("MODE:", import.meta.env.MODE);
console.log("API:", import.meta.env.VITE_API_URL);


export const authService = {
  login: api.login,
  register: api.register,
  getCurrentUser: api.getCurrentUser,
  logout: api.logout,
};
