import React, { useCallback, useMemo } from "react";
import { api } from "../../services/api";
import getSessionId from "../../services/uuidSessionGenerator";
import GameCard from "../shared/GameCard";
import useAsync from "../../hooks/useAsync";
import PageLoading from "../loading/PageLoading";

const GameCardLoader = ({ ageGroup }) => {
  const loadGames = useCallback(
    () => api.getGamesFor(ageGroup, getSessionId()),
    [ageGroup]
  );
  const { data, isLoading, error } = useAsync(loadGames);

  const games = useMemo(() => {
    const list = data ?? [];
    return [...list].sort((a, b) => {
      if (a.preview_image_url && !b.preview_image_url) return -1;
      if (!a.preview_image_url && b.preview_image_url) return 1;
      return 0;
    });
  }, [data]);

  if (isLoading) return <PageLoading />;
  if (error) {
    console.error(error);
    return null;
  }
  if (data?.length == 0) {
    return (
      <div className="text-black text-2xl">
        Sorry, there are no games for {ageGroup} right now
      </div>
    );
  }

  return (
    <>
      {games?.map((game, _) => (
        <GameCard key={game.id} data={game} />
      ))}
    </>
  );
};

export default GameCardLoader;
