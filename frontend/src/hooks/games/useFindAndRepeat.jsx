import { useCallback, useEffect, useRef, useState } from "react";
import useGameSession from "../useGameSession";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

export const PHASES = {
  FINDING: "finding",
  RECORDING: "recording",
  REVIEWING: "reviewing",
};

const CARDS_PER_STAGE = 4;

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const toAudioUrl = (path) => {
  if (!path) return null;
  return path.startsWith("blob:") ? path : `${VITE_API_BASE}/${path}`;
};

// Build an ordered list of stages across all levels.
// Each level plays `stages_count` rounds (default: every card once, non-repeating).
// Each stage shows the target together with up to CARDS_PER_STAGE-1 random
// distractors from the same level — the target is ALWAYS among the options.
const buildStages = (levels) =>
  levels.flatMap((level) => {
    const cards = level.cards || [];
    const count =
      level.stages_count && level.stages_count > 0
        ? Math.min(level.stages_count, cards.length)
        : cards.length;

    return shuffle(cards)
      .slice(0, count)
      .map((target) => {
        const distractors = shuffle(
          cards.filter((c) => c.card_id !== target.card_id),
        ).slice(0, CARDS_PER_STAGE - 1);
        return {
          levelId: level.level_id,
          target,
          options: shuffle([target, ...distractors]),
        };
      });
  });

const useFindAndRepeat = (gameData) => {
  const {
    isSaving,
    isFinished,
    isAuthenticated,
    finalScore,
    bestScore,
    finishGame,
  } = useGameSession(gameData?.id);

  const config = gameData?.config_data ?? {};

  // Stages are built ONCE per loaded game and kept in state. They must not be
  // rebuilt on re-render (buildStages is random) — otherwise the played target
  // would desync from the shown cards and re-recording would pick a new card.
  const [stages, setStages] = useState([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [phase, setPhase] = useState(PHASES.FINDING);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isBusy, setIsBusy] = useState(false);

  const correctRef = useRef(0);
  const audioRef = useRef(null);
  const tokenRef = useRef(0);
  const introStageRef = useRef(-1);

  const currentStage = stages[stageIndex];

  // Build (and reset) the game whenever a new game is loaded.
  useEffect(() => {
    setStages(buildStages(gameData?.config_data?.levels ?? []));
    setStageIndex(0);
    setPhase(PHASES.FINDING);
    setRecordedUrl(null);
    setCorrectCount(0);
    correctRef.current = 0;
    introStageRef.current = -1;
  }, [gameData]);

  const stopAudio = useCallback(() => {
    tokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const playOne = useCallback((url, token) => {
    return new Promise((resolve) => {
      if (!url || token !== tokenRef.current) return resolve();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(() => resolve());
    });
  }, []);

  const playSequence = useCallback(
    async (paths) => {
      stopAudio();
      const token = tokenRef.current;
      setIsBusy(true);
      await paths.reduce(
        (chain, path) =>
          chain.then(() =>
            token === tokenRef.current ? playOne(toAudioUrl(path), token) : null,
          ),
        Promise.resolve(),
      );
      if (token === tokenRef.current) setIsBusy(false);
    },
    [playOne, stopAudio],
  );

  // Play the target's sound once per finding stage. The "find and repeat"
  // intro phrase is spoken only on the very first stage so it doesn't become
  // a repetitive, tiring robotic prompt.
  useEffect(() => {
    if (!currentStage || phase !== PHASES.FINDING) return;
    if (introStageRef.current === stageIndex) return;
    introStageRef.current = stageIndex;
    const sequence =
      stageIndex === 0
        ? [config.find_prompt_audio, currentStage.target.reference_audio]
        : [currentStage.target.reference_audio];
    playSequence(sequence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage, phase, stageIndex]);

  // Stop any playing audio when the game unmounts.
  useEffect(() => stopAudio, [stopAudio]);

  // Revoke the recording URL when it changes / on unmount.
  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const onCardClick = useCallback(
    (card) => {
      if (phase !== PHASES.FINDING || !currentStage) return;
      if (card.card_id === currentStage.target.card_id) {
        setPhase(PHASES.RECORDING);
        playSequence([card.reference_audio]);
      } else {
        playSequence([card.reference_audio]);
      }
    },
    [phase, currentStage, playSequence],
  );

  const playReview = useCallback(
    (recording) => {
      playSequence([
        currentStage?.target.reference_audio,
        recording,
        config.confirm_prompt_audio,
      ]);
    },
    [currentStage, config.confirm_prompt_audio, playSequence],
  );

  const onRecordingFinish = useCallback(
    async (audioBlob) => {
      // the previous recording URL is revoked by the recordedUrl cleanup effect
      const url = URL.createObjectURL(audioBlob);
      setRecordedUrl(url);
      setPhase(PHASES.REVIEWING);
      playReview(url);
    },
    [playReview],
  );

  const replayReview = useCallback(() => {
    if (recordedUrl) playReview(recordedUrl);
  }, [recordedUrl, playReview]);

  const replayWord = useCallback(() => {
    if (currentStage) playSequence([currentStage.target.reference_audio]);
  }, [currentStage, playSequence]);

  const advance = useCallback(
    async (wasCorrect) => {
      stopAudio();
      setRecordedUrl(null);

      const newCorrect = correctRef.current + (wasCorrect ? 1 : 0);
      correctRef.current = newCorrect;
      setCorrectCount(newCorrect);

      const next = stageIndex + 1;
      if (next < stages.length) {
        setStageIndex(next);
        setPhase(PHASES.FINDING);
      } else {
        const score = stages.length
          ? Math.round((newCorrect / stages.length) * 100)
          : 0;
        await finishGame(score);
      }
    },
    [stageIndex, stages.length, finishGame, stopAudio],
  );

  const confirmCorrect = useCallback(() => advance(true), [advance]);
  const skip = useCallback(() => advance(false), [advance]);

  return {
    // data
    stages,
    currentStage,
    stageIndex,
    phase,
    correctCount,
    isBusy,
    recordedUrl,
    // actions
    onCardClick,
    onRecordingFinish,
    replayReview,
    replayWord,
    confirmCorrect,
    skip,
    // session
    isSaving,
    isFinished,
    isAuthenticated,
    finalScore,
    bestScore,
  };
};

export default useFindAndRepeat;
