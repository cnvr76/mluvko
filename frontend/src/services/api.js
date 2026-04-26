import axios from "axios";
import { GET, POST, DELETE } from "./methods";

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
export const Roles = {
  PARENT: "parent",
  ADMIN: "admin",
  THERAPIST: "therapist",
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
  getMyProfile: async () => GET("/users/me", "Failed to fetch my profile:"),
  getMyFavoriteGames: async () =>
    GET("/games/favorite", "Failed to fetch my favorite games:"),
  getAllGames: async () => GET("/games", "Failed to fetch all games:"),
  getGamesFor: async (ageGroup) =>
    GET(
      `/games/group/${ageGroup}`,
      `Failed to fetch games for age group ${ageGroup}:`
    ),
  getGameById: async (gameId) =>
    GET(`/games/${gameId}`, `Failed to fetch game by id ${gameId}:`),
  // functions for posting basic stuff
  toggleFavorite: async (gameId, isFavorite) => {
    if (isFavorite) {
      return POST(
        `/games/${gameId}/favorite`,
        {},
        "Failed to mark game as favorite"
      );
    } else {
      return DELETE(
        `/games/${gameId}/favorite`,
        {},
        "Failed to delete game from favorites"
      );
    }
  },
  updateStats: async (gameId, score) =>
    POST(
      `/games/${gameId}/update-stats`,
      { score },
      `Failed to update stats for gameId ${gameId} by ${score}:`
    ),
  // functions for voice analyzing
  analyzeSpeech: async (audioBlob, referenceText) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.webm");
    formData.append("reference_text", referenceText);

    return POST(
      "/speech/stt",
      formData,
      `Failed to send speech evalution request for ${referenceText}:`,
      {
        "Content-Type": "multipart/form-data",
      }
    );
  },
};
