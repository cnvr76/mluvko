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
    return (
      <section className="flex flex-col justify-center items-center">
        <h1>Dakujem za hru!</h1>
        <span>Current score: {finalScore}</span>
        <span>Best score: {bestScore}</span>
      </section>
    );
  }

  const threshold = data?.config_data.score_threshold;

  return (
    <section>
      <AnimalCard gameData={currentCard} currentScore={currentScore || 0} />
      <div className="flex justify-center items-center gap-30 mt-10">
        <PlayAudioButton referenceAudioLink={currentCard?.reference_audio} />
        <RecordAudioButton onFinish={onRecordingEnd} isLoading={isSubmitting} />
        {currentScore && currentScore >= threshold && (
          <NextButton onClick={nextCard} />
        )}
      </div>
    </section>
  );
};

export default RepeatAfter;
