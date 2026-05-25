import React from "react";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import Header from "./Header";
import PageLoading from "../loading/PageLoading";
import PageReady from "../loading/PageReady";

const Layout = () => {
  const navigation = useNavigation();
  const location = useLocation();

  // Only treat navigation to a different page as a global load. Same-page
  // changes (e.g. ?tab= in the profile) are in-page subloads, not a page change.
  const isNavigating =
    navigation.state === "loading" &&
    navigation.location?.pathname !== location.pathname;

  return (
    <>
      <Header />
      {isNavigating ? (
        <PageLoading />
      ) : (
        <PageReady>
          <Outlet />
        </PageReady>
      )}
    </>
  );
};

export default Layout;
