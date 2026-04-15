import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthAction } from "../../hooks/useAuthAction";
import { api } from "../../services/api";

const GameCard = ({ data }) => {
  const [isStarred, setIsStarred] = useState(data.is_favorite || false);
  const withAuth = useAuthAction();

  const handleFavorite = async () => {
    const toggledState = !isStarred;
    setIsStarred(toggledState);
    await api.toggleFavorite(data.id, toggledState);
  };

  return (
    <div className="relative hover:rotate-[-1deg] origin-center cursor-pointer select-none transition-transform duration-200 ease-out">
      <div className="absolute z-30 right-5 top-5">
        <button
          className="cursor-pointer hover:scale-125 hover:rotate-12 transition-transform duration-200 ease-out"
          onClick={withAuth(handleFavorite)}
        >
          <i
            className={`fa-${
              isStarred ? "solid" : "regular"
            } fa-star text-3xl text-yellow-400`}
          ></i>
        </button>
      </div>
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
            flex flex-col items-center justify-between
          "
        >
          <div className="w-[90%] aspect-square overflow-hidden rounded-2xl mt-4">
            <img
              src={
                data.preview_image_url || "/images/games_page/shared/card.png"
              }
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-white text-xl font-semibold mb-6 drop-shadow-sm drop-shadow-gray-500 text-center">
            {data.name}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default GameCard;
