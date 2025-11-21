import React from "react";
import Header from "../components/shared/Header";

const SpecificGamePage = ({ children }) => {
  return (
    <div
      className="
        w-screen
        min-h-screen
        flex
        justify-center
        items-start
        pt-20
        bg-no-repeat
        bg-cover
        bg-center
      "
      style={{
        backgroundImage: "url('/images/repeatAfter__background.png')",
      }}
    >
      <Header fixed />
      {children}
    </div>
  );
};

export default SpecificGamePage;
