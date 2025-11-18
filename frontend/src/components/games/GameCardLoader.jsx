import React, { useCallback } from "react";
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
    <>{data && data.map((game) => <GameCard key={game.id} data={game} />)}</>
  );
};

export default GameCardLoader;
