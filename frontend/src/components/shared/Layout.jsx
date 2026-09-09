import React from "react";
import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import Header from "./Header";

const Layout = () => {
  return (
    <NuqsAdapter>
      <Header />
      <Outlet />
    </NuqsAdapter>
  );
};

export default Layout;
