import axios from "axios";
import { GET, POST, DELETE, PATCH } from "./methods";

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
  getMyCreatedGames: async () =>
    GET("/games/my", "Failed to fetch my created games:"),
  getAllGames: async () => GET("/games", "Failed to fetch all games:"),
  getGamesFor: async (ageGroup) =>
    GET(
      `/games/group/${ageGroup}`,
      `Failed to fetch games for age group ${ageGroup}:`
    ),
  getGameById: async (gameId) =>
    GET(`/games/${gameId}`, `Failed to fetch game by id ${gameId}:`),
  getSnapshotInfo: async (gameId, snapshotId) =>
    GET(`/versions/${snapshotId}/game/${gameId}`),

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
  deleteGame: async (gameId) =>
    DELETE(`/games/${gameId}`, "Chyba pri mazaní hry:"),
  saveGame: async (gameId, data) =>
    PATCH(
      `/versions/${gameId}/draft`,
      data,
      "Error while saving draft occured:"
    ),
  initDraft: async () =>
    POST("/versions/init/draft", {}, "Couldn't initialized draft:"),

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
  generateTTS: async (text) =>
    POST(
      `/speech/tts?speech_text=${encodeURIComponent(text)}`,
      {},
      "Failed to generate TTS:"
    ),

  // --- ADMIN ROUTES ---
  getAdminDashboard: async () =>
    GET("/admin/dashboard/snapshots", "Chyba načítania dashboardu:"),
  approveSnapshot: async (gameId, snapshotId) =>
    POST(`/admin/${gameId}/approve/${snapshotId}`, {}, "Chyba schvaľovania:"),

  // Для отклонения pending версий
  rejectPendingSnapshot: async (gameId, snapshotId, reason) =>
    POST(
      `/admin/${gameId}/reject/${snapshotId}`,
      { reason },
      "Chyba zamietnutia verzie:"
    ),

  // Для отзыва уже опубликованной игры
  revokeGame: async (gameId, reason) =>
    POST(`/admin/${gameId}/revoke`, { reason }, "Chyba zrušenia hry:"),

  rollbackGame: async (gameId, targetSnapshotId, reason) =>
    POST(
      `/admin/${gameId}/rollback/${targetSnapshotId}`,
      { reason },
      "Chyba rollbacku:"
    ),

  // --- VERSIONS / THERAPIST ROUTES ---
  submitForReview: async (gameId) =>
    POST(`/versions/${gameId}/submit`, {}, "Chyba odosielania na kontrolu:"),
  getSnapshotInfo: async (gameId, snapshotId) =>
    GET(
      `/versions/${snapshotId}/game/${gameId}`,
      "Chyba načítania detailov verzie:"
    ),
  getSnapshotForTesting: async (gameId, snapshotId) =>
    GET(
      `/versions/testing/${snapshotId}/game/${gameId}`,
      "Chyba načítania verzie pre testovanie:"
    ),
};
