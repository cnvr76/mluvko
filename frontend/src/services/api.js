import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const AgeGroups = {
  JUNIOR: "2-4 roky",
  MIDDLE: "5-6 rokov",
};

export const GameTypes = {
  PEXESO: "pexeso",
  REPEAT_AFTER: "repeat_after",
};

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  withCredentials: true,
});

export const api = {
  // registration route
  login: async (email, password) => {
    return apiClient.post("/auth/login", {
      email,
      password,
    });
  },
  signup: async (username, email, password) => {
    return apiClient.post("/auth/signup", {
      username,
      email,
      password,
    });
  },
  // functions just for requesting basic stuff
  getAllGames: async () => {
    return apiClient
      .get("/games")
      .then((response) => response?.data)
      .catch((error) => {
        console.error("Failed to fetch all games:", error);
        throw error;
      });
  },
  getGamesFor: async (ageGroup) => {
    return apiClient
      .get(`/games/group/${ageGroup}`)
      .then((response) => response?.data)
      .catch((error) => {
        console.error(
          `Failed to fetch games for age group ${ageGroup}:`,
          error
        );
        throw error;
      });
  },
  getGameById: async (gameId) => {
    return apiClient
      .get(`/games/${gameId}`)
      .then((response) => response?.data)
      .catch((error) => {
        console.error(`Failed to fetch game by id ${gameId}:`, error);
        throw error;
      });
  },
  // functions for posting basic stuff
  updateStats: async (gameId, score) => {
    return apiClient
      .post(`/games/${gameId}/update-stats`, {
        score,
      })
      .then((response) => response?.data)
      .catch((error) => {
        console.error(
          `Failed to update stats for gameId ${gameId} by ${score}:`,
          error
        );
        throw error;
      });
  },
  // functions for voice analyzing
  analyzeSpeech: async (audioBlob, referenceText) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.webm");
    formData.append("reference_text", referenceText);

    return apiClient
      .post("/speech/stt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data)
      .catch((error) => {
        console.error(
          `Failed to send speech evalution request for ${referenceText}:`,
          error
        );
        throw error;
      });
  },
};
