import { api, API_BASE } from "../services/api";

/**
 * Prevod uloženej cesty k médiu na URL použiteľnú v <img> / <audio>.
 *
 * Vstupy môžu byť:
 *  - absolútna URL (http(s)://...) → vraciame nezmenenú,
 *  - blob:/data: URL → vraciame nezmenenú,
 *  - cesta začínajúca "/" (napr. "/images/...") → public folder frontendu,
 *  - relatívna backend cesta (napr. "static/audio/x.mp3",
 *    "static/uploads/images/y.png") → prefixujeme API_BASE.
 */
export const resolveMediaUrl = (path) => {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  if (path.startsWith("/")) return path;
  return `${API_BASE}/${path}`;
};

/**
 * Backend ukladá generované TTS do `static/audio` / `static/combined` a používa
 * vlastný delete endpoint. Pre používateľské uploady (`static/uploads/...`) je
 * iný endpoint. Tento helper to schová pred volajúcim – pošle DELETE na ten
 * správny route podľa prefixu cesty.
 *
 * Pre cesty mimo backendu (externé URL, public folder) nerobí nič.
 */
export const deleteServerFile = async (path) => {
  if (!path || typeof path !== "string") return;
  if (/^(https?:|blob:|data:)/.test(path)) return;
  if (path.startsWith("/")) return;

  try {
    if (path.startsWith("static/uploads/")) {
      await api.uploads.deleteFile(path);
    } else if (
      path.startsWith("static/audio/") ||
      path.startsWith("static/combined/")
    ) {
      await api.speech.deleteAudio(path);
    }
  } catch {
    // mazanie je best-effort – neblokujeme UX kvôli osirelému súboru
  }
};
