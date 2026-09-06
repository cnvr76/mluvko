import React from "react";
import AnimalCard from "./AnimalCard";
import PlayAudioButton from "./PlayAudioButton";
import RecordAudioButton from "./RecordAudioButton";
import NextButton from "./NextButton";
import PageLoading from "../../loading/PageLoading.jsx";
import useRepeatAfter from "../../../hooks/games/useRepeatAfter";
import EndGameScreen from "../EndGameScreen";
import useGameSession from "../../../hooks/useGameSession";
import useMediaReady from "../../../hooks/useMediaReady";
import useMediaPrefetch from "../../../hooks/useMediaPrefetch";
import { previewUrl } from "../../../utils/pendingMedia";
import { NEXT_ICON, REPEAT_AFTER_MEDIA, SKIP_ICON } from "./media";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

const RepeatAfter = ({ gameId, snapshotId }) => {
  const { data, isLoading, error, ...session } = useGameSession(
    gameId,
    snapshotId,
  );
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
  } = useRepeatAfter(data, session);

  const currentCardImage = previewUrl(currentCard?.animal_image_url);
  const isMediaReady = useMediaReady(
    [...REPEAT_AFTER_MEDIA, currentCardImage],
    !isLoading && !error,
  );
  useMediaPrefetch([
    NEXT_ICON,
    ...(data?.config_data?.cards ?? []).map((card) =>
      previewUrl(card.animal_image_url),
    ),
  ]);

  const onRecordingEnd = async (audioBlob) => {
    if (!currentCard) return;
    await evaluateSpeech(audioBlob, currentCard.reference_text);
  };

  if (error) {
    console.error(error);
    return null;
  }
  if (isLoading || isSaving || !isMediaReady) return <PageLoading />;

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
        <PlayAudioButton
          referenceAudioLink={`${VITE_API_BASE}/${currentCard?.reference_audio}`}
        />
        <RecordAudioButton onFinish={onRecordingEnd} isLoading={isSubmitting} />
        <NextButton
          onClick={nextCard}
          isDisabled={isSubmitting}
          icon={SKIP_ICON}
        />
        {currentScore && currentScore >= threshold && (
          <NextButton onClick={nextCard} isDisabled={isSubmitting} />
        )}
      </div>
    </section>
  );
};

export default RepeatAfter;
