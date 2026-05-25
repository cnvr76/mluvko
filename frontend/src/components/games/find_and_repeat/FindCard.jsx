import React from "react";

const FindCard = ({ card, onClick, disabled, highlighted }) => {
  return (
    <button
      onClick={() => onClick(card)}
      disabled={disabled}
      className={`
        aspect-square
        w-full
        rounded-3xl
        bg-white/30
        backdrop-blur-xl
        border
        ${highlighted ? "border-[#ff7110] ring-4 ring-[#ff7110]/40" : "border-white/40"}
        shadow-[0_10px_30px_rgba(0,0,0,0.18)]
        flex items-center justify-center
        p-4 md:p-6
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-60 disabled:hover:scale-100
        cursor-pointer disabled:cursor-default
      `}
    >
      <img
        src={card.image_url}
        alt={card.name}
        className="max-h-full max-w-full object-contain drop-shadow-lg pointer-events-none"
      />
    </button>
  );
};

export default FindCard;
