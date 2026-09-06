// Backstop only. Generous on purpose: it is measured from the call, and on a
// slow link a request can sit queued far longer than it takes to transfer.
const MAX_WAIT_MS = 30000;
const DECODE_TIMEOUT_MS = 2000;

const requests = new Map();
const loaded = new Set();
const listeners = new Set();

// Hot-swapping this module strands the app on an empty cache and every screen
// hangs behind its loader, so a change here forces a full reload.
import.meta.hot?.accept(() => import.meta.hot.invalidate());

export const preloadImage = (src) => {
  if (!src) return Promise.resolve();

  const pending = requests.get(src);
  if (pending) return pending;

  const request = new Promise((resolve) => {
    const img = new Image();
    const deadline = setTimeout(finish, MAX_WAIT_MS);

    function finish() {
      clearTimeout(deadline);
      loaded.add(src);
      listeners.forEach((notify) => notify());
      resolve();
    }

    img.onerror = finish;
    img.onload = () => {
      // onload means the bytes arrived, not that the bitmap can be painted; for
      // a large image the decode lands several frames later. A hidden document
      // never decodes, so it skips the wait.
      if (!img.decode || document.hidden) return finish();

      const decodeDeadline = setTimeout(finish, DECODE_TIMEOUT_MS);
      const settle = () => {
        clearTimeout(decodeDeadline);
        finish();
      };
      img.decode().then(settle, settle);
    };

    img.src = src;
  });

  requests.set(src, request);
  return request;
};

export const isPreloaded = (src) => !src || loaded.has(src);

export const subscribeToLoaded = (notify) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};
