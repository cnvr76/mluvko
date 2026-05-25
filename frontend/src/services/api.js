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
  FIND_AND_REPEAT: "find_and_repeat",
};
export const Roles = {
  PARENT: "parent",
  ADMIN: "admin",
  THERAPIST: "therapist",
};
export const RoleLabels = {
  [Roles.PARENT]: "Rodič",
  [Roles.THERAPIST]: "Logopéd",
  [Roles.ADMIN]: "Admin",
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
  updateMyProfile: async (data) =>
    PATCH("/users/me", data, "Chyba pri aktualizácii profilu:"),
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
  deleteAudio: async (path) =>
    DELETE(
      `/speech/audio?path=${encodeURIComponent(path)}`,
      {},
      "Failed to delete audio:"
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

  // --- USER MANAGEMENT (ADMIN) ---
  getAllUsers: async () =>
    GET("/users/all", "Chyba načítania používateľov:"),
  updateUser: async (userId, data) =>
    PATCH(`/users/${userId}`, data, "Chyba pri aktualizácii používateľa:"),
  deleteUser: async (userId) =>
    DELETE(`/users/${userId}`, {}, "Chyba pri mazaní používateľa:"),

  // --- ROLE REQUESTS ---
  getMyRoleRequest: async () =>
    GET("/role-requests/me", "Chyba načítania žiadosti o rolu:"),
  requestTherapistRole: async () =>
    POST("/role-requests/", {}, "Chyba pri odoslaní žiadosti o rolu:"),
  getAllRoleRequests: async () =>
    GET("/role-requests/", "Chyba načítania žiadostí o rolu:"),
  approveRoleRequest: async (requestId) =>
    POST(
      `/role-requests/${requestId}/approve`,
      {},
      "Chyba pri schvaľovaní žiadosti:"
    ),
  rejectRoleRequest: async (requestId, reason) =>
    POST(
      `/role-requests/${requestId}/reject`,
      { reason },
      "Chyba pri zamietnutí žiadosti:"
    ),

  // --- VERSIONS / THERAPIST ROUTES ---
  submitForReview: async (gameId) =>
    POST(`/versions/${gameId}/submit`, {}, "Chyba odosielania na kontrolu:"),
  archiveGame: async (gameId) =>
    POST(`/versions/${gameId}/archive`, {}, "Chyba pri archivácii hry:"),
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
