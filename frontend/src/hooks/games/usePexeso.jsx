import { useEffect, useMemo, useState } from "react";
import useGameSession from "../useGameSession";
import { v4 as uuidv4 } from "uuid";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

const usePexeso = (gameData) => {
  const { isSaving, isFinished, finalScore, bestScore, finishGame } =
    useGameSession(gameData?.id);
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [isChecking, setIsChecking] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(true);
  const [moves, setMoves] = useState(0);

  const cards = useMemo(() => {
    const list = gameData?.config_data.cards ?? [];

    const transformCard = (card) => ({
      ...card,
      matchId: card.id,
      id: uuidv4(),
    });

    const set1 = list.map(transformCard);
    const set2 = list.map(transformCard);

    return [...set1, ...set2].sort(() => Math.random() - 0.5);
  }, [gameData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreviewing(false);
    }, 2500); // 2500 (2.5s) can be changed
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (flippedIds.length < 2) return;

    setIsChecking(true);
    setMoves((prev) => prev + 1);

    const [firstId, secondId] = flippedIds;
    const card1 = cards.find((c) => c.id == firstId);
    const card2 = cards.find((c) => c.id == secondId);

    if (card1.matchId === card2.matchId) {
      setMatchedIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(card1.matchId);
        return newSet;
      });

      const audioLink = `${VITE_API_BASE}${card1.animal_audio}`;
      const audio = new Audio(audioLink);
      audio
        .play()
        .catch((error) =>
          console.error(`Error playing sound ${audioLink}:`, error)
        );

      console.log(matchedIds);
      setFlippedIds([]);
      setIsChecking(false);
    } else {
      const timer = setTimeout(() => {
        setFlippedIds([]);
        setIsChecking(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [flippedIds, cards]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const totalPairs = cards.length / 2;
      if (totalPairs > 0 && matchedIds.size === totalPairs) {
        const extraMoves = Math.max(0, moves - totalPairs);
        const score = Math.max(0, 100 - extraMoves * 5);
        finishGame(score);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [matchedIds, cards.length, moves, finishGame]);

  const markFlipped = (card) => {
    if (
      isChecking ||
      isPreviewing ||
      flippedIds.includes(card.id) ||
      matchedIds.has(card.matchId)
    )
      return;
    setFlippedIds((prev) => [...prev, card.id]);
  };

  return {
    // card lists
    cards,
    matchedIds,
    flippedIds,
    // methods
    markFlipped,
    // score
    moves,
    // final
    finalScore,
    bestScore,
    isFinished,
    // loading
    isSaving,
    isChecking,
    isPreviewing,
  };
};

export default usePexeso;
