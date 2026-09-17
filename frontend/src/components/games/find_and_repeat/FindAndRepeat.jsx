import React from "react";
import useGameSession from "../../../hooks/useGameSession";
import useFindAndRepeat, {
  PHASES,
} from "../../../hooks/games/useFindAndRepeat";
import PageLoading from "../../loading/PageLoading.jsx";
import EndGameScreen from "../EndGameScreen";
import FindCard from "./FindCard";
import RecordAudioButton from "../repeat_after/RecordAudioButton";
import NextButton from "../repeat_after/NextButton";
import RoundIconButton from "../RoundIconButton";
import { FIND_PROMPT_TEXT, CONFIRM_PROMPT_TEXT } from "./prompts";
import useMediaReady from "../../../hooks/useMediaReady";
import useMediaPrefetch from "../../../hooks/useMediaPrefetch";
import { previewUrl } from "../../../utils/pendingMedia";
import {
  APP_BACKGROUND,
  PLAY_AUDIO_ICON,
  RECORD_AUDIO_ICON,
  SKIP_ICON,
} from "../../../constants/media";

const FIND_AND_REPEAT_MEDIA = [
  APP_BACKGROUND,
  PLAY_AUDIO_ICON,
  RECORD_AUDIO_ICON,
  SKIP_ICON,
];

const TargetCard = ({ card }) => (
  <div
    className="
      relative w-full max-w-[20rem]
      rounded-3xl surface-glass bg-white/20 border-white/30 shadow-card
      flex flex-col items-center
      px-6 py-5 gap-3
    "
  >
    <img
      src={previewUrl(card.image_url)}
      alt=""
      className="max-h-[clamp(8rem,22vw,11rem)] w-auto object-contain drop-shadow-lg"
    />
    <span className="text-fluid-3xl font-bold text-text">{card.name}</span>
  </div>
);

const ReplayButton = ({ onClick, disabled }) => (
  <RoundIconButton
    icon={PLAY_AUDIO_ICON}
    label="Prehrať znova"
    onClick={onClick}
    disabled={disabled}
  />
);

const FindAndRepeat = ({ gameId, snapshotId }) => {
  const { data, isLoading, error, ...session } = useGameSession(
    gameId,
    snapshotId,
  );

  const {
    stages,
    currentStage,
    stageIndex,
    phase,
    isBusy,
    onCardClick,
    onRecordingFinish,
    replayReview,
    replayWord,
    confirmCorrect,
    skip,
    isSaving,
    isFinished,
    finalScore,
    bestScore,
  } = useFindAndRepeat(data, session);

  const isMediaReady = useMediaReady(
    [
      ...FIND_AND_REPEAT_MEDIA,
      ...(currentStage?.options ?? []).map((card) =>
        previewUrl(card.image_url),
      ),
    ],
    !isLoading && !error,
  );
  useMediaPrefetch(
    (data?.config_data?.levels ?? []).flatMap((level) =>
      (level.cards ?? []).map((card) => previewUrl(card.image_url)),
    ),
  );

  if (error) {
    console.error(error);
    return null;
  }
  if (isLoading || isSaving || !isMediaReady) return <PageLoading />;

  if (isFinished) {
    return <EndGameScreen currentScore={finalScore} bestScore={bestScore} />;
  }

  if (!stages.length || !currentStage) {
    // distinguish "still building stages right after load" from a genuinely empty game
    const hasCards = (data?.config_data?.levels ?? []).some(
      (level) => (level.cards?.length ?? 0) > 0,
    );
    if (hasCards) return <PageLoading />;

    return (
      <div className="text-text text-fluid-2xl font-bold text-center px-6">
        Táto hra zatiaľ nemá žiadne kartičky.
      </div>
    );
  }

  // per-level progress so the start of a new level is obvious
  const stagesInLevel = stages.filter(
    (s) => s.levelId === currentStage.levelId,
  ).length;
  const stageInLevel = stages
    .slice(0, stageIndex + 1)
    .filter((s) => s.levelId === currentStage.levelId).length;

  return (
    <section
      className="
        w-full
        flex flex-col items-center justify-center
        gap-[clamp(1.25rem,3vw,1.5rem)] py-4
      "
    >
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="
            px-6 py-2
            rounded-full
            bg-text
            text-white
            text-fluid-2xl
            font-extrabold
            shadow-control
          "
        >
          Úroveň {currentStage.levelId}
        </span>
        <span className="text-text/80 text-fluid-sm font-semibold">
          Etapa {stageInLevel}/{stagesInLevel}
        </span>
      </div>

      {phase === PHASES.FINDING && (
        <>
          <h2 className="text-fluid-3xl font-bold text-text text-center">
            {FIND_PROMPT_TEXT}
          </h2>

          <div className="grid grid-cols-2 gap-[clamp(1rem,3vw,1.25rem)] w-full max-w-[29rem]">
            {currentStage.options.map((card) => (
              <FindCard
                key={card.card_id}
                card={card}
                onClick={onCardClick}
                disabled={isBusy}
              />
            ))}
          </div>

          <div className="flex items-center gap-[clamp(1rem,3vw,1.5rem)]">
            <ReplayButton onClick={replayWord} disabled={isBusy} />
            <NextButton
              onClick={skip}
              isDisabled={isBusy}
              icon={SKIP_ICON}
              label="Preskočiť"
            />
          </div>
        </>
      )}

      {phase === PHASES.RECORDING && (
        <>
          <TargetCard card={currentStage.target} />

          <p className="text-fluid-xl font-semibold text-text text-center">
            Stlač mikrofón a zopakuj slovo.
          </p>

          <div className="flex items-center gap-[clamp(1rem,3vw,1.5rem)]">
            <ReplayButton onClick={replayWord} disabled={isBusy} />
            <RecordAudioButton
              onFinish={onRecordingFinish}
              isLoading={false}
              disabled={isBusy}
            />
            <NextButton
              onClick={skip}
              isDisabled={isBusy}
              icon={SKIP_ICON}
              label="Preskočiť"
            />
          </div>
        </>
      )}

      {phase === PHASES.REVIEWING && (
        <>
          <TargetCard card={currentStage.target} />

          <p className="text-fluid-xl font-semibold text-text text-center">
            {CONFIRM_PROMPT_TEXT}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-[clamp(0.75rem,3vw,1.25rem)]">
            <ReplayButton onClick={replayReview} disabled={isBusy} />

            <RecordAudioButton
              onFinish={onRecordingFinish}
              isLoading={false}
              disabled={isBusy}
            />

            <NextButton
              onClick={skip}
              isDisabled={isBusy}
              icon={SKIP_ICON}
              label="Preskočiť"
            />

            <RoundIconButton
              label="Správne"
              onClick={confirmCorrect}
              disabled={isBusy}
              tone="success"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3/5 h-3/5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12.5 9.5 18 20 6.5" />
              </svg>
            </RoundIconButton>
          </div>
        </>
      )}
    </section>
  );
};

export default FindAndRepeat;
