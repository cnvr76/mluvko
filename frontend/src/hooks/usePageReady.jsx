import { useEffect, useRef, useState } from "react";

// Maximum time we keep the page hidden — a safety net so a hung/never-resolving
// resource can't block the whole page forever.
const MAX_WAIT_MS = 8000;

// Tracks whether everything inside a container (images + web fonts) has finished
// loading. Meant for *global page* readiness, not for in-section data fetches —
// those should keep their own loading states.
//
// Usage:
//   const { ref, ready } = usePageReady(resetKey);
//   return <div ref={ref}>{...}</div>;
// Pass a value that changes per page (e.g. location.key) as `resetKey` so the
// gate re-runs on navigation.
const usePageReady = (resetKey) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    // wait a frame so the children (and their <img> tags) are mounted
    const raf = requestAnimationFrame(() => {
      const container = ref.current;
      if (!container) {
        finish();
        return;
      }

      const images = Array.from(container.querySelectorAll("img"));
      const pending = images.filter((img) => !img.complete);

      const imageWaiters = pending.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          }),
      );

      const fontsReady =
        document.fonts && document.fonts.ready
          ? document.fonts.ready
          : Promise.resolve();

      Promise.all([fontsReady, ...imageWaiters]).then(finish);
    });

    const timeout = setTimeout(finish, MAX_WAIT_MS);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [resetKey]);

  return { ref, ready };
};

export default usePageReady;
