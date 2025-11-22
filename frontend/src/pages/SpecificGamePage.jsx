// src/pages/SpecificGamePage.jsx
import React from "react";
import Header from "../components/shared/Header";

const SpecificGamePage = ({ children }) => {
  return (
    <>
      <Header />

      <main
        className="
          w-screen
          min-h-screen
          flex
          justify-center
          items-start
          pt-24
          pb-10
          px-3
          bg-no-repeat
          bg-cover
          bg-center
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
