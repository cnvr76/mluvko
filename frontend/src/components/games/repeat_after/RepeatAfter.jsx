import React, { useCallback, useMemo, useState } from "react";
import useAsync from "../../../hooks/useAsync";
import { api } from "../../../services/api";
import getSessionId from "../../../services/uuidSessionGenerator";
import AnimalCard from "./AnimalCard";
import PlayAudioButton from "./PlayAudioButton";
import RecordAudioButton from "./RecordAudioButton";
import NextButton from "./NextButton";
import PageLoading from "../../loading/PageLoading.jsx";
import useRepeatAfter from "../../../hooks/games/useRepeatAfter";
import EndGameScreen from "../EndGameScreen";
// import { useQueryState, parseAsInteger } from "nuqs";

const RepeatAfter = ({ gameId }) => {
  const getGame = useCallback(
    () => api.getGameById(gameId, getSessionId()),
    [gameId]
  );
  const { data, isLoading, error } = useAsync(getGame);
  const {
    // current
    currentCard,
    currentScore,
    // methods
    nextCard,
    evaluateSpeech,
    // final
    finalScore,
    bestScore,
    isFinished,
    // loading
    isSaving,
    isSubmitting,
  } = useRepeatAfter(data);

  const onRecordingEnd = useCallback(
    async (audioBlob) => {
      await evaluateSpeech(audioBlob, currentCard.reference_text);
    },
    [evaluateSpeech, currentCard]
  );

  if (isLoading || isSaving) return <PageLoading />;
  if (error) {
    console.error(error);
    return null;
  }

  if (isFinished) {
    return <EndGameScreen currentScore={finalScore} bestScore={bestScore} />;
  }

  const threshold = data?.config_data.score_threshold;

  return (
    <section
      className="
    w-full
    min-h-[calc(100vh-10rem)]  
    flex flex-col items-center justify-center
   
  "
    >
      <AnimalCard gameData={currentCard} currentScore={currentScore || 0} />
      <div
        className=" mt-8
        flex flex-row justify-center items-center
        gap-4 md:gap-6"
      >
        <PlayAudioButton referenceAudioLink={currentCard?.reference_audio} />
        <RecordAudioButton onFinish={onRecordingEnd} isLoading={isSubmitting} />
        <NextButton onClick={nextCard} />
        {currentScore && currentScore >= threshold && (
          <NextButton onClick={nextCard} />
        )}
      </div>
    </section>
  );
};

export default RepeatAfter;
