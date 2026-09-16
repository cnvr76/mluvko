import React, { useState } from "react";
import { Link } from "react-router-dom";
import useRequireAuth from "../../hooks/useRequireAuth";
import useApiMutation from "../../hooks/useApiMutation";
import { api } from "../../services/api";
import { previewUrl } from "../../utils/pendingMedia";
import { GAME_CARD_FALLBACK } from "../../constants/media";

const GameCard = ({ data, onFavoriteToggle }) => {
  const [isStarred, setIsStarred] = useState(data.is_favorite || false);
  const requireAuthOrRedirect = useRequireAuth();

  const toggleFavoriteMutation = useApiMutation(
    ({ id, isFavorite }) => api.games.toggleFavorite(id, isFavorite),
    {
      errorMessage: "Nepodarilo sa uložiť obľúbenú hru.",
      onError: (error, { id, isFavorite }) => {
        setIsStarred(!isFavorite);
        onFavoriteToggle?.(id, !isFavorite);
      },
    },
  );

  const handleFavorite = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (requireAuthOrRedirect() || toggleFavoriteMutation.isPending) return;

    const isFavorite = !isStarred;
    setIsStarred(isFavorite);
    onFavoriteToggle?.(data.id, isFavorite);
    toggleFavoriteMutation.mutate({ id: data.id, isFavorite });
  };

  return (
    <div className="relative w-full max-w-64 select-none origin-center transition-transform duration-200 ease-out hover:rotate-[-1deg]">
      <button
        type="button"
        onClick={handleFavorite}
        aria-pressed={isStarred}
        aria-label={
          isStarred ? "Odobrať z obľúbených" : "Pridať medzi obľúbené"
        }
        className="
          absolute z-30 right-4 top-4
          text-fluid-3xl text-yellow
          cursor-pointer
          transition-transform duration-200 ease-out
          hover:scale-125 hover:rotate-12
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        "
      >
        <i
          className={`fa-${isStarred ? "solid" : "regular"} fa-star`}
          aria-hidden="true"
        />
      </button>

      <Link
        to={`/games/${data.id}/${data.game_type}`}
        className="
          block no-underline rounded-3xl
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        "
      >
        <div
          className="
            relative aspect-[3/4]
            rounded-3xl p-4
            surface-glass bg-white/20 border-white/30 shadow-card
            flex flex-col items-center justify-between gap-4
          "
        >
          <div className="w-[90%] aspect-square overflow-hidden rounded-2xl mt-4">
            <img
              src={previewUrl(data.preview_image_url) || GAME_CARD_FALLBACK}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-white text-fluid-xl font-semibold mb-4 drop-shadow-sm drop-shadow-gray-500 text-center text-balance">
            {data.name}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default GameCard;
