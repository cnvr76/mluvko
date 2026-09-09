import React from "react";
import { APP_BACKGROUND } from "../constants/media";

const SpecificGamePage = ({ children }) => {
  return (
    <main
      className="
        w-screen h-screen overflow-hidden bg-no-repeat bg-cover bg-center px-3 pt-16 sm:pt-20
        "
      style={{
        backgroundImage: `url('${APP_BACKGROUND}')`,
      }}
    >
      {children}
    </main>
  );
};

export default SpecificGamePage;
