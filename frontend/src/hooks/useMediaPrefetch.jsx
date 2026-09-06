import { useEffect } from "react";
import { preloadImage } from "../utils/preloadImage";

const useMediaPrefetch = (urls) => {
  useEffect(() => {
    urls.forEach(preloadImage);
  });
};

export default useMediaPrefetch;
