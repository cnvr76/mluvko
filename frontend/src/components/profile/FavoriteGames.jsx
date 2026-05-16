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

  if (loading) return <PageLoading />;

  if (games.length === 0)
    return <div>You don't have any favorite games at the moment</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          data={game}
          onFavoriteToggle={handleFavoriteToggle}
        />
      ))}
    </div>
  );
};

export default FavoriteGames;
