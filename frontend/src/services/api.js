import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const AgeGroups = {
  JUNIOR: "2-4 roky",
  MIDDLE: "5-6 rokov",
};

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export const api = {
  // functions just for requesting basic staff
  getAllGames: async (userSessionId) => {
    return apiClient
      .get("/games", {
        params: {
          user_session_id: userSessionId,
        },
      })
      .then((response) => response?.data)
      .catch((error) => {
        console.error("Failed to fetch all games:", error);
        throw error;
      });
  },
  getGamesFor: async (ageGroup, userSessionId) => {
    return apiClient
      .get(`/games/group/${ageGroup}`, {
        params: {
          user_session_id: userSessionId,
        },
      })
      .then((response) => response?.data)
      .catch((error) => {
        console.error(
          `Failed to fetch games for age group ${ageGroup}:`,
          error
        );
        throw error;
      });
  },
  getGameById: async (gameId, userSessionId) => {
    return apiClient
      .get(`/games/${gameId}`, {
        params: {
          user_session_id: userSessionId,
        },
      })
      .then((response) => response?.data)
      .catch((error) => {
        console.error(`Failed to fetch game by id ${gameId}:`, error);
        throw error;
      });
  },
  // functions for voice analyzing
  analyzeSpeech: async () => {},
};
