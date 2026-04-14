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

const get = async (url, errorMessage) => {
  return apiClient
    .get(url)
    .then((response) => response?.data)
    .catch((error) => {
      console.error(errorMessage, error);
      throw error;
    });
};
const post = async (url, body, errorMessage, headers = {}) => {
  return apiClient
    .post(url, body, { headers })
    .then((response) => response?.data)
    .catch((error) => {
      console.error(errorMessage, error);
      throw error;
    });
};

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
  getMyProfile: async () => get("/users/me", "Failed to fetch my profile:"),
  getMyFavoriteGames: async () =>
    get("/games/favorite", "Failed to fetch my favorite games:"),
  getAllGames: async () => get("/games", "Failed to fetch all games:"),
  getGamesFor: async (ageGroup) =>
    get(
      `/games/group/${ageGroup}`,
      `Failed to fetch games for age group ${ageGroup}:`
    ),
  getGameById: async (gameId) =>
    get(`/games/${gameId}`, `Failed to fetch game by id ${gameId}:`),
  // functions for posting basic stuff
  updateStats: async (gameId, score) =>
    post(
      `/games/${gameId}/update-stats`,
      { score },
      `Failed to update stats for gameId ${gameId} by ${score}:`
    ),
  // functions for voice analyzing
  analyzeSpeech: async (audioBlob, referenceText) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.webm");
    formData.append("reference_text", referenceText);

    return post(
      "/speech/stt",
      formData,
      `Failed to send speech evalution request for ${referenceText}:`,
      {
        "Content-Type": "multipart/form-data",
      }
    );
  },
};
