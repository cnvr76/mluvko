// src/pages/SpecificGamePage.jsx
import React from "react";
import Header from "../components/shared/Header";

const SpecificGamePage = ({ children }) => {
  return (
    <>
      <Header />

      <main
        className="
        w-screen h-screen overflow-hidden bg-no-repeat bg-cover bg-center px-3 pt-16 sm:pt-20
        "
        style={{
          backgroundImage: "url('/images/repeatAfter__background.png')",
        }}
      >
        {children}
      </main>
    </>
  );
};

export default SpecificGamePage;
