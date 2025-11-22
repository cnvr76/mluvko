import React, { useState } from "react";

const NextButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
      w-14 h-14 md:w-20 md:h-20
      rounded-full
      bg-white/30
      backdrop-blur-xl
      border border-white/40
      shadow-[0_4px_20px_rgba(0,0,0,0.15)]
      flex items-center justify-center
      transition-all duration-200
      hover:scale-105 active:scale-95
      "
    >
      <img
        src="/images/NextButton.png"
        alt="Next"
        className="w-8 h-8 md:w-10 md:h-10 object-contain"
      />
    </button>
  );
};

export default NextButton;
