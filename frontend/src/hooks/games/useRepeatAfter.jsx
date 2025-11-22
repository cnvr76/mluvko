import React, { useCallback, useMemo, useState } from "react";
import useGameSession from "../useGameSession";
import { api } from "../../services/api";

const useRepeatAfter = (gameData) => {
  const { isSaving, isFinished, finalScore, bestScore, finishGame } =
    useGameSession(gameData?.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [currentScore, setCurrentScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cards = useMemo(() => {
    const list = gameData?.config_data.cards ?? [];
    return [...list].sort((a, b) => a.card_id > b.card_id);
  }, [gameData]);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex >= cards.length - 1;

  const nextCard = useCallback(async () => {
    const newScores = [...scores, currentScore || 0];
    setScores(newScores);
    setCurrentScore(null);
    if (!isLastCard) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const averageScore =
        scores.reduce((prev, curr) => prev + curr, 0) / scores.length;
      await finishGame(averageScore);
      setCurrentIndex(0);
    }
  }, [currentScore, isLastCard, scores, finishGame, setCurrentIndex]);

  const evaluateSpeech = useCallback(
    async (audioBlob, referenceText) => {
      setIsSubmitting(true);
      let response = null;
      try {
        response = await api.analyzeSpeech(audioBlob, referenceText);
        setCurrentScore(response?.score);
      } catch (error) {
        console.error("Error evaluating speech", error);
      } finally {
        console.log("analyze response:", response);
        setIsSubmitting(false);
      }
    },
    [setCurrentScore]
  );

  return {
    // current
    currentCard,
    currentScore,
    currentIndex,
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
  };
};

export default useRepeatAfter;
