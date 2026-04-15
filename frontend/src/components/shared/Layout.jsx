import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "./Header";
import PageLoading from "../loading/PageLoading";

const Layout = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <>
      <Header />
      {isNavigating ? <PageLoading /> : <Outlet />}
    </>
  );
};

export default Layout;
