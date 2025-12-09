import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ data }) => {
  return (
    <Link to={`/games/${data.id}/${data.game_type}`} className="no-underline">
      <div
        key={data.id}
        className="
        relative w-[220px] md:w-[260px] aspect-[3/4]
        rounded-3xl p-4
        bg-white/20
        backdrop-blur-xl
        border border-white/30
        shadow-[0_10px_30px_rgba(0,0,0,0.2)]
        transition-transform duration-200 ease-out
        hover:-translate-y-1 cursor-pointer select-none
        flex flex-col items-center justify-between"
      >
        <div className="w-[90%] aspect-square overflow-hidden rounded-2xl mt-4">
          <img
            src={data.preview_image_url || "/images/games_page/shared/card.png"}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-white text-xl font-semibold mb-6 drop-shadow-md text-center">
          {data.name}
        </p>
      </div>
    </Link>
  );
};

export default GameCard;
