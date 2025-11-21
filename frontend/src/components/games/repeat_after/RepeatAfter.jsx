import React, { useCallback, useMemo, useState } from "react";
import useAsync from "../../../hooks/useAsync";
import { api } from "../../../services/api";
import getSessionId from "../../../services/uuidSessionGenerator";
import AnimalCard from "./AnimalCard";
import PlayAudioButton from "./PlayAudioButton";
import RecordAudioButton from "./RecordAudioButton";
import NextButton from "./NextButton";
import PageLoading from "../../loading/PageLoading.jsx";
import { useQueryState, parseAsInteger } from "nuqs";

const RepeatAfter = ({ gameId }) => {
  const getGame = useCallback(
    () => api.getGameById(gameId, getSessionId()),
    [gameId]
  );
  const { data, isLoading, error } = useAsync(getGame);

  const cards = useMemo(() => {
    const list = data?.config_data.cards ?? [];
    return [...list].sort((a, b) => a.card_id - b.card_id);
  }, [data]);

  const [currentGameIndex, setCurrentGameIndex] = useQueryState(
    "current_game",
    parseAsInteger.withDefault(0)
  );
  // const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [scores, setScores] = useState([]);

  const incrementIndex = useCallback(() => {
    setCurrentGameIndex((prev) => prev + 1);
  }, []);

  const sendForAnalysis = useCallback(() => {}, []);

  if (isLoading) return <PageLoading />;
  if (error) {
    console.error(error);
    return null;
  }

  console.log("data:", data);
  console.log("cards:", cards);

  return (
    <section>
      <AnimalCard gameData={cards?.[currentGameIndex]} />
      <div className="flex justify-center items-center gap-30 mt-10">
        <PlayAudioButton
          referenceAudioLink={cards?.[currentGameIndex]?.reference_audio}
        />
        <RecordAudioButton
          referenceText={cards?.[currentGameIndex]?.reference_text}
        />
        <NextButton
          onClick={incrementIndex}
          onEnd={data ? currentGameIndex >= cards?.length : false}
        />
      </div>
    </section>
  );
};

export default RepeatAfter;
