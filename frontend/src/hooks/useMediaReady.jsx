import { useSyncExternalStore } from "react";
import { isPreloaded, subscribeToLoaded } from "../utils/preloadImage";
import useMediaPrefetch from "./useMediaPrefetch";

const useMediaReady = (urls, isDataReady = true) => {
  useMediaPrefetch(urls);

  const isCached = useSyncExternalStore(subscribeToLoaded, () =>
    urls.every(isPreloaded),
  );

  return isDataReady && isCached;
};

export default useMediaReady;
