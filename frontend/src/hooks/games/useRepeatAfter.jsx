import { useState } from "react";
import { api } from "../../services/api";

const analyzeSpeech = async (audioBlob, referenceText) => {
  try {
    const response = await api.speech.analyze(audioBlob, referenceText);
    return response?.score;
  } catch (error) {
    console.error("Error evaluating speech", error);
    return null;
  }
};

const useRepeatAfter = (
  gameData,
  { isSaving, isFinished, isAuthenticated, finalScore, bestScore, finishGame },
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [currentScore, setCurrentScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cards = [...(gameData?.config_data.cards ?? [])].sort(
    (a, b) => a.card_id > b.card_id,
  );

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex >= cards.length - 1;

  const nextCard = async () => {
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
  };

  const evaluateSpeech = async (audioBlob, referenceText) => {
    setIsSubmitting(true);
    const score = await analyzeSpeech(audioBlob, referenceText);
    if (score != null) setCurrentScore(score);
    setIsSubmitting(false);
  };

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
    isAuthenticated,
    // loading
    isSaving,
    isSubmitting,
  };
};

export default useRepeatAfter;
