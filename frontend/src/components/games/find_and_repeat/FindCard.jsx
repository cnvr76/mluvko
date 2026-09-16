import React from "react";
import { previewUrl } from "../../../utils/pendingMedia";

const FindCard = ({ card, onClick, disabled, highlighted }) => {
  return (
    <button
      onClick={() => onClick(card)}
      disabled={disabled}
      className={`
        aspect-square
        w-full
        rounded-3xl
        surface-glass bg-white/30 shadow-card
        ${highlighted ? "border-accent ring-4 ring-accent/40" : "border-white/40"}
        flex items-center justify-center
        p-[clamp(1rem,3vw,1.5rem)]
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-60 disabled:hover:scale-100
        cursor-pointer disabled:cursor-default
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
      `}
    >
      <img
        src={previewUrl(card.image_url)}
        alt={card.name}
        className="max-h-full max-w-full object-contain drop-shadow-lg pointer-events-none"
      />
    </button>
  );
};

export default FindCard;
