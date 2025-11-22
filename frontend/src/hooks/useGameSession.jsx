import React, { useCallback, useState } from "react";
import { api } from "../services/api";
import getSessionId from "../services/uuidSessionGenerator";

const useGameSession = (gameId) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [bestScore, setBestScore] = useState(null);

  const finishGame = useCallback(
    async (score) => {
      setIsSaving(true);
      setFinalScore(score);
      setBestScore(score);
      setIsFinished(true);
      try {
        const response = await api.updateStats(gameId, getSessionId(), score);
        setBestScore(response?.best_score);
      } catch (error) {
        console.error("Failed to update game score:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [gameId]
  );

  return {
    isSaving,
    isFinished,
    finalScore,
    bestScore,
    finishGame,
  };
};

export default useGameSession;
