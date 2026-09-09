import React from "react";
import useGameSession from "../../../hooks/useGameSession";
import useFindAndRepeat, { PHASES } from "../../../hooks/games/useFindAndRepeat";
import PageLoading from "../../loading/PageLoading.jsx";
import EndGameScreen from "../EndGameScreen";
import FindCard from "./FindCard";
import RecordAudioButton from "../repeat_after/RecordAudioButton";
import NextButton from "../repeat_after/NextButton";
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

const ROUND_BTN = `
  w-14 h-14 md:w-20 md:h-20
  rounded-full
  bg-white/30
  backdrop-blur-xl
  border border-white/40
  shadow-[0_4px_20px_rgba(0,0,0,0.15)]
  flex items-center justify-center
  transition-all duration-200
  hover:scale-105 active:scale-95 cursor-pointer
  disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default
`;

const TargetCard = ({ card }) => (
  <div
    className="
      relative
      w-full max-w-[320px]
      rounded-3xl
      bg-white/20
      backdrop-blur-xl
      border border-white/30
      shadow-[0_10px_30px_rgba(0,0,0,0.2)]
      flex flex-col items-center
      px-6 py-5 gap-3
    "
  >
    <img
      src={previewUrl(card.image_url)}
      alt={card.name}
      className="h-32 md:h-44 object-contain drop-shadow-lg"
    />
    <span className="text-2xl md:text-3xl font-bold text-[#642f37]">
      {card.name}
    </span>
  </div>
);

const ReplayButton = ({ onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={ROUND_BTN}>
    <img
      src={PLAY_AUDIO_ICON}
      alt="Prehrať znova"
      className="w-10 h-10 object-contain"
    />
  </button>
);

const FindAndRepeat = ({ gameId, snapshotId }) => {
  const { data, isLoading, error, ...session } = useGameSession(gameId, snapshotId);

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
      ...(currentStage?.options ?? []).map((card) => previewUrl(card.image_url)),
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
      <div className="text-[#642f37] text-2xl font-bold text-center px-6">
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
        w-full h-full
        flex flex-col items-center justify-center
        gap-5 md:gap-6
        overflow-y-auto py-4
      "
    >
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="
            px-6 py-2
            rounded-full
            bg-[#642f37]
            text-white
            text-xl md:text-2xl
            font-extrabold
            shadow-[0_4px_15px_rgba(0,0,0,0.2)]
          "
        >
          Úroveň {currentStage.levelId}
        </span>
        <span className="text-[#642f37]/80 text-sm md:text-base font-semibold">
          Etapa {stageInLevel}/{stagesInLevel}
        </span>
      </div>

      {phase === PHASES.FINDING && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-[#642f37] text-center">
            {FIND_PROMPT_TEXT}
          </h2>

          <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-[460px]">
            {currentStage.options.map((card) => (
              <FindCard
                key={card.card_id}
                card={card}
                onClick={onCardClick}
                disabled={isBusy}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <ReplayButton onClick={replayWord} disabled={isBusy} />
            <NextButton
              onClick={skip}
              isDisabled={isBusy}
              icon={SKIP_ICON}
            />
          </div>
        </>
      )}

      {phase === PHASES.RECORDING && (
        <>
          <TargetCard card={currentStage.target} />

          <p className="text-lg md:text-xl font-semibold text-[#642f37] text-center">
            Stlač mikrofón a zopakuj slovo.
          </p>

          <div className="flex items-center gap-4 md:gap-6">
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
            />
          </div>
        </>
      )}

      {phase === PHASES.REVIEWING && (
        <>
          <TargetCard card={currentStage.target} />

          <p className="text-lg md:text-xl font-semibold text-[#642f37] text-center">
            {CONFIRM_PROMPT_TEXT}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            <ReplayButton onClick={replayReview} disabled={isBusy} />

            <RecordAudioButton
              onFinish={onRecordingFinish}
              isLoading={false}
              disabled={isBusy}
            />

            <button
              onClick={confirmCorrect}
              disabled={isBusy}
              className="
                px-7 py-4
                rounded-full
                bg-[#a5ad24]
                hover:bg-[#92991f]
                text-white
                text-lg font-bold
                shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default
              "
            >
              Správne ✓
            </button>

            <NextButton
              onClick={skip}
              isDisabled={isBusy}
              icon={SKIP_ICON}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default FindAndRepeat;
