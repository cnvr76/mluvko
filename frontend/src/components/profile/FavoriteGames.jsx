import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import GameCard from "../shared/GameCard";
import PageLoading from "../loading/PageLoading";

const FavoriteGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMyFavoriteGames()
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFavoriteToggle = (gameId, isNowFavorite) => {
    if (!isNowFavorite) {
      setGames((prev) => prev.filter((game) => game.id !== gameId));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Obľúbené hry</h2>

        <div
          className="
          rounded-[2rem]
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_20px_rgba(0,0,0,0.12)]
          p-8
          text-center
          text-[#642f37]
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
        <h2 className="text-3xl font-bold">
          Momentálne nemáš žiadne obľúbené hry
        </h2>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-extrabold drop-shadow">Obľúbené hry</h2>

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
