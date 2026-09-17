import React from "react";
import { APP_BACKGROUND } from "../constants/media";

const SpecificGamePage = ({ children }) => {
  return (
    <main className="relative isolate w-full min-h-dvh flex px-3 pt-header pb-8">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url('${APP_BACKGROUND}')` }}
      />
      {children}
    </main>
  );
};

export default SpecificGamePage;
