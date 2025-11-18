import React, { useCallback } from "react";
import useAsync from "../../../hooks/useAsync";
import { api } from "../../../services/api";
import getSessionId from "../../../services/uuidSessionGenerator";
import AnimalCard from "./AnimalCard";
import PlayAudioButton from "./PlayAudioButton";
import RecordAudioButton from "./RecordAudioButton";

const RepeatAfter = ({ gameId }) => {
  const getGame = useCallback(
    () => api.getGameById(gameId, getSessionId()),
    [gameId]
  );
  const { data, isLoading, error } = useAsync(getGame);

  if (isLoading) return <div className="text-black text-2xl">Loading...</div>;
  if (error) {
    console.error(error);
    return null;
  }

  return (
    <section>
      <AnimalCard />
      <div>
        <PlayAudioButton />
        <RecordAudioButton />
      </div>
    </section>
  );
};

export default RepeatAfter;
