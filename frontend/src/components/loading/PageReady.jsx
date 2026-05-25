import React from "react";
import { useLocation } from "react-router-dom";
import usePageReady from "../../hooks/usePageReady";
import PageLoading from "./PageLoading";

// Wraps page content and shows the duck loader until everything (images + fonts)
// inside it has fully loaded. Re-runs only when the page (pathname) changes — not
// on query-param changes like switching profile tabs, which are in-page subloads.
const PageReady = ({ children }) => {
  const location = useLocation();
  const { ref, ready } = usePageReady(location.pathname);

  return (
    <>
      {!ready && <PageLoading />}

      <div ref={ref} aria-hidden={!ready} style={{ visibility: ready ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
};

export default PageReady;
