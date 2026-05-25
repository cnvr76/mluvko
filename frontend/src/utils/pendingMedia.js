import { api } from "../services/api";
import { resolveMediaUrl } from "./mediaPaths";

/**
 * Lokálny "pending" zástupca pre súbor, ktorý si používateľ vybral (Upload /
 * Record / ImageUpload), ale ešte ho neuložil. Na server sa nepošle skôr, než
 * stlačí „Uložiť zmeny" v editore.
 *
 * Tvar:
 *   { __pending: true, kind: 'audio' | 'image', file: File }
 *
 * Hodnoty v `config_data` / `formData` môžu byť teda buď string (server path),
 * alebo PendingFile (lokálne vybraný súbor).
 */

export const PENDING_AUDIO = "audio";
export const PENDING_IMAGE = "image";

export const makePending = (file, kind) => ({
  __pending: true,
  kind,
  file,
});

export const isPendingFile = (v) =>
  !!v && typeof v === "object" && v.__pending === true && v.file instanceof Blob;

/**
 * URL použiteľná v `<img>` / `<audio>` pre hodnotu, ktorá môže byť:
 *  - prázdna,
 *  - PendingFile → blob URL,
 *  - serverový reťazec → resolveMediaUrl.
 */
export const previewUrl = (value) => {
  if (!value) return "";
  if (isPendingFile(value)) return URL.createObjectURL(value.file);
  return resolveMediaUrl(value);
};

const isServerMediaPath = (v) =>
  typeof v === "string" &&
  (v.startsWith("static/uploads/") ||
    v.startsWith("static/audio/") ||
    v.startsWith("static/combined/"));

/**
 * Rekurzívne zbiera všetky serverové cesty k médiám zo stromu (pole / objekt /
 * primitív). PendingFile nezapočítava (nie je na serveri).
 */
export const collectMediaPaths = (node, acc = new Set()) => {
  if (node == null) return acc;
  if (typeof node === "string") {
    if (isServerMediaPath(node)) acc.add(node);
    return acc;
  }
  if (typeof node !== "object") return acc;
  if (isPendingFile(node)) return acc;

  if (Array.isArray(node)) {
    for (const item of node) collectMediaPaths(item, acc);
    return acc;
  }

  for (const key of Object.keys(node)) {
    collectMediaPaths(node[key], acc);
  }
  return acc;
};

/**
 * Hlboký klon, ktorý po ceste nahradí každý PendingFile výsledkom uploadu.
 * Nemení pôvodný objekt.
 *
 * `kind === 'audio'` → api.uploadAudio,
 * `kind === 'image'` → api.uploadImage.
 *
 * Ak ktorýkoľvek upload zlyhá, chyba sa propaguje hore – volajúci to spracuje
 * (napr. ukáže alert a NEzavolá PATCH).
 */
export const uploadPendingFiles = async (root) => {
  const walk = async (node) => {
    if (node == null) return node;
    if (isPendingFile(node)) {
      if (node.kind === PENDING_IMAGE) {
        return await api.uploadImage(node.file);
      }
      // default = audio
      return await api.uploadAudio(node.file);
    }
    if (Array.isArray(node)) {
      const out = new Array(node.length);
      for (let i = 0; i < node.length; i++) out[i] = await walk(node[i]);
      return out;
    }
    if (typeof node === "object") {
      const out = {};
      for (const key of Object.keys(node)) {
        out[key] = await walk(node[key]);
      }
      return out;
    }
    return node;
  };

  return await walk(root);
};
