import React, { useState } from "react";

const NextButton = ({ icon, onClick, isDisabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="
      w-14 h-14 md:w-20 md:h-20
      rounded-full
      bg-white/30
      backdrop-blur-xl
      border border-white/40
      shadow-[0_4px_20px_rgba(0,0,0,0.15)]
      flex items-center justify-center
      transition-all duration-200
      hover:scale-105 active:scale-95 cursor-pointer
      "
    >
      <img
        src={icon || "/images/icons/NextButton.png"}
        alt="Next"
        className="w-10 h-10 md:w-12 md:h-12 object-contain"
      />
    </button>
  );
};

export default NextButton;
