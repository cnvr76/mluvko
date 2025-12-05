import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const AgeGroups = {
  JUNIOR: "2-4 roky",
  MIDDLE: "5-6 rokov",
};

export const GameTypes = {
  PEXESO: "pexeso",
  REPEAT_AFTER: "repeat_after",
};

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const api = {
  // functions just for requesting basic stuff
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
  // functions for posting basic stuff
  updateStats: async (gameId, userSessionId, score) => {
    return apiClient
      .post(`/games/${gameId}/update-stats`, {
        user_session_id: userSessionId,
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
