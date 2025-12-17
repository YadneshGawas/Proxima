import { hackathonApi } from "./hackathon.api";
// import { hackathonMock } from "./hackathon.mock";

const USE_MOCK = false; // 🔥 flip to false when backend is live

export const hackathonService = {
  getAll: (params: any) => {
    if (USE_MOCK) {
      // return hackathonMock.getAll();
    }
    return hackathonApi.getAll(params);
  },

  getById: (id: string) => {
    if (USE_MOCK) {
      // return hackathonMock.getById(id);
    }
    return hackathonApi.getById(id);
  },

  create: (data: any) => hackathonApi.create(data),
  update: (id: string, data: any) => hackathonApi.update(id, data),
  delete: (id: string) => hackathonApi.delete(id),
  toggleInterest: (id: string, inc = true) =>
    hackathonApi.toggleInterest(id, inc),
};
