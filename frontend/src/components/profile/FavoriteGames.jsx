import React from "react";
import { Link } from "react-router-dom";
import useFavoriteGames from "../../hooks/profile/useFavoriteGames";
import GameCard from "../shared/GameCard";
import PageLoading from "../loading/PageLoading";
import PanelHeader from "./PanelHeader";

const FavoriteGames = () => {
  const { games, isLoading, handleFavoriteToggle } = useFavoriteGames();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PanelHeader title="Obľúbené hry" />

        <div
          className="
          surface-glass rounded-card
          p-8
          text-center
          text-text
          font-semibold
        "
        >
          Načítavam obľúbené hry...
        </div>
      </div>
    );
  }

  if (games.length === 0)
    return (
      <div className="flex flex-col gap-4">
        <PanelHeader title="Obľúbené hry" />

        <div
          className="
            surface-glass rounded-card
            p-8
            text-center
            text-text
          "
        >
          <p className="text-fluid-xl font-bold mb-2">
            Momentálne nemáš žiadne obľúbené hry
          </p>

          <p className="opacity-70 mb-6">
            Označ si hry hviezdičkou a zobrazia sa tu. Vyber si hru na hlavnej
            stránke.
          </p>

          <Link
            to="/"
            className="btn-pill bg-accent hover:bg-accent-hover text-white font-bold shadow-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Objaviť hry
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Obľúbené hry" />

      <div
        className="
        pt-2
        grid
        grid-cols-[repeat(auto-fit,minmax(260px,1fr))]
        gap-8
        justify-items-center
      "
      >
        {games.map((game) => (
          <GameCard
            key={game.id}
            data={game}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteGames;
