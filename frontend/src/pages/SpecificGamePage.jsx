import React from "react";

const SpecificGamePage = ({ children }) => {
  return (
    <main
      className="
        w-screen h-screen overflow-hidden bg-no-repeat bg-cover bg-center px-3 pt-16 sm:pt-20
        "
      style={{
        backgroundImage: "url('/images/background.png')",
      }}
    >
      {children}
    </main>
  );
};

export default SpecificGamePage;
