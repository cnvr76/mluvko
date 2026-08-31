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

// Every non-auth request goes through this client — AuthContext attaches the
// access-token/refresh-on-401 interceptors to it.
export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  withCredentials: true,
});

// Auth routes deliberately bypass apiClient's interceptors: /auth/refresh and
// /auth/logout are what the 401 handler itself calls, so routing them through
// apiClient would recurse, and a stale refresh cookie could otherwise turn a
// plain invalid-credentials /auth/login into a surprise silent-refresh retry.
const authClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
});

const request = async (
  client,
  url,
  { method = "GET", data, headers, errorMessage } = {}
) => {
  try {
    const response = await client.request({ url, method, data, headers });
    return response.data;
  } catch (error) {
    if (errorMessage) console.error(errorMessage, error);
    throw error;
  }
};

const call = (url, options) => request(apiClient, url, options);
const authCall = (url, options) => request(authClient, url, options);

const multipart = { "Content-Type": "multipart/form-data" };

export const api = {
  auth: {
    login: (email, password) =>
      authCall("/auth/login", { method: "POST", data: { email, password } }),
    signup: (username, email, password) =>
      authCall("/auth/signup", {
        method: "POST",
        data: { username, email, password },
      }),
    refresh: () => authCall("/auth/refresh", { method: "POST" }),
    logout: () => authCall("/auth/logout", { method: "POST" }),
  },

  users: {
    me: () => call("/users/me", { errorMessage: "Failed to fetch my profile:" }),
    updateMe: (data) =>
      call("/users/me", {
        method: "PATCH",
        data,
        errorMessage: "Chyba pri aktualizácii profilu:",
      }),
    all: () => call("/users/all", { errorMessage: "Chyba načítania používateľov:" }),
    update: (userId, data) =>
      call(`/users/${userId}`, {
        method: "PATCH",
        data,
        errorMessage: "Chyba pri aktualizácii používateľa:",
      }),
    delete: (userId) =>
      call(`/users/${userId}`, {
        method: "DELETE",
        errorMessage: "Chyba pri mazaní používateľa:",
      }),
  },

  games: {
    all: () => call("/games", { errorMessage: "Failed to fetch all games:" }),
    forAgeGroup: (ageGroup) =>
      call(`/games/group/${ageGroup}`, {
        errorMessage: `Failed to fetch games for age group ${ageGroup}:`,
      }),
    byId: (gameId) =>
      call(`/games/${gameId}`, {
        errorMessage: `Failed to fetch game by id ${gameId}:`,
      }),
    favorite: () =>
      call("/games/favorite", { errorMessage: "Failed to fetch my favorite games:" }),
    myCreated: () =>
      call("/games/my", { errorMessage: "Failed to fetch my created games:" }),
    delete: (gameId) =>
      call(`/games/${gameId}`, {
        method: "DELETE",
        errorMessage: "Chyba pri mazaní hry:",
      }),
    updateStats: (gameId, score) =>
      call(`/games/${gameId}/update-stats`, {
        method: "POST",
        data: { score },
        errorMessage: `Failed to update stats for gameId ${gameId} by ${score}:`,
      }),
    toggleFavorite: (gameId, isFavorite) =>
      call(`/games/${gameId}/favorite`, {
        method: isFavorite ? "POST" : "DELETE",
        errorMessage: isFavorite
          ? "Failed to mark game as favorite"
          : "Failed to delete game from favorites",
      }),
  },

  versions: {
    initDraft: () =>
      call("/versions/init/draft", {
        method: "POST",
        errorMessage: "Couldn't initialized draft:",
      }),
    saveDraft: (gameId, data) =>
      call(`/versions/${gameId}/draft`, {
        method: "PATCH",
        data,
        errorMessage: "Error while saving draft occured:",
      }),
    submit: (gameId) =>
      call(`/versions/${gameId}/submit`, {
        method: "POST",
        errorMessage: "Chyba odosielania na kontrolu:",
      }),
    archive: (gameId) =>
      call(`/versions/${gameId}/archive`, {
        method: "POST",
        errorMessage: "Chyba pri archivácii hry:",
      }),
    info: (gameId, snapshotId) =>
      call(`/versions/${snapshotId}/game/${gameId}`, {
        errorMessage: "Chyba načítania detailov verzie:",
      }),
    forTesting: (gameId, snapshotId) =>
      call(`/versions/testing/${snapshotId}/game/${gameId}`, {
        errorMessage: "Chyba načítania verzie pre testovanie:",
      }),
  },

  admin: {
    dashboard: () =>
      call("/admin/dashboard/snapshots", { errorMessage: "Chyba načítania dashboardu:" }),
    approve: (gameId, snapshotId) =>
      call(`/admin/${gameId}/approve/${snapshotId}`, {
        method: "POST",
        errorMessage: "Chyba schvaľovania:",
      }),
    reject: (gameId, snapshotId, reason) =>
      call(`/admin/${gameId}/reject/${snapshotId}`, {
        method: "POST",
        data: { reason },
        errorMessage: "Chyba zamietnutia verzie:",
      }),
    revoke: (gameId, reason) =>
      call(`/admin/${gameId}/revoke`, {
        method: "POST",
        data: { reason },
        errorMessage: "Chyba zrušenia hry:",
      }),
    rollback: (gameId, targetSnapshotId, reason) =>
      call(`/admin/${gameId}/rollback/${targetSnapshotId}`, {
        method: "POST",
        data: { reason },
        errorMessage: "Chyba rollbacku:",
      }),
  },

  roleRequests: {
    mine: () =>
      call("/role-requests/me", { errorMessage: "Chyba načítania žiadosti o rolu:" }),
    all: () =>
      call("/role-requests/", { errorMessage: "Chyba načítania žiadostí o rolu:" }),
    create: () =>
      call("/role-requests/", {
        method: "POST",
        errorMessage: "Chyba pri odoslaní žiadosti o rolu:",
      }),
    approve: (requestId) =>
      call(`/role-requests/${requestId}/approve`, {
        method: "POST",
        errorMessage: "Chyba pri schvaľovaní žiadosti:",
      }),
    reject: (requestId, reason) =>
      call(`/role-requests/${requestId}/reject`, {
        method: "POST",
        data: { reason },
        errorMessage: "Chyba pri zamietnutí žiadosti:",
      }),
  },

  speech: {
    analyze: (audioBlob, referenceText) => {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recording.webm");
      formData.append("reference_text", referenceText);
      return call("/speech/stt", {
        method: "POST",
        data: formData,
        headers: multipart,
        errorMessage: `Failed to send speech evalution request for ${referenceText}:`,
      });
    },
    generateTTS: (text) =>
      call(`/speech/tts?speech_text=${encodeURIComponent(text)}`, {
        method: "POST",
        errorMessage: "Failed to generate TTS:",
      }),
    deleteAudio: (path) =>
      call(`/speech/audio?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
        errorMessage: "Failed to delete audio:",
      }),
  },

  uploads: {
    audio: (file) => {
      const formData = new FormData();
      formData.append("audio_file", file);
      return call("/uploads/audio", {
        method: "POST",
        data: formData,
        headers: multipart,
        errorMessage: "Failed to upload audio:",
      });
    },
    image: (file) => {
      const formData = new FormData();
      formData.append("image_file", file);
      return call("/uploads/image", {
        method: "POST",
        data: formData,
        headers: multipart,
        errorMessage: "Failed to upload image:",
      });
    },
    deleteFile: (path) =>
      call(`/uploads/file?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
        errorMessage: "Failed to delete uploaded file:",
      }),
  },
};
