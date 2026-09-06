import React from "react";

export const SPECIFIC_GAME_BACKGROUND = "/images/background.png";

const SpecificGamePage = ({ children }) => {
  return (
    <main
      className="
        w-screen h-screen overflow-hidden bg-no-repeat bg-cover bg-center px-3 pt-16 sm:pt-20
        "
      style={{
        backgroundImage: `url('${SPECIFIC_GAME_BACKGROUND}')`,
      }}
    >
      {children}
    </main>
  );
};

export default SpecificGamePage;
