import { useState } from "react";
import { api } from "../../services/api";
import useApiMutation from "../useApiMutation";

const resolveSpeechScore = async (mutateAsync, audioBlob, referenceText) => {
  try {
    const response = await mutateAsync({ audioBlob, referenceText });
    return response?.score ?? null;
  } catch {
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

  const analyzeSpeechMutation = useApiMutation(
    ({ audioBlob, referenceText }) => api.speech.analyze(audioBlob, referenceText),
    { errorMessage: "Nepodarilo sa vyhodnotiť nahrávku." },
  );

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
    const score = await resolveSpeechScore(
      analyzeSpeechMutation.mutateAsync,
      audioBlob,
      referenceText,
    );
    if (score != null) setCurrentScore(score);
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
    isSubmitting: analyzeSpeechMutation.isPending,
  };
};

export default useRepeatAfter;
