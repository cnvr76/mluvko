import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Pexeso from "./pexeso/Pexeso";
import RepeatAfter from "./repeat_after/RepeatAfter";
import { GameTypes } from "../../services/api";
import SpecificGamePage from "../../pages/SpecificGamePage";

const GameHolder = () => {
  const { gameId, gameType } = useParams();
  const [searchParams] = useSearchParams();
  const snapshotId = searchParams.get("snapshot");

  const getCorrectGameComponent = () => {
    switch (gameType) {
      case GameTypes.PEXESO:
        return <Pexeso gameId={gameId} snapshotId={snapshotId} />;
      case GameTypes.REPEAT_AFTER:
        return <RepeatAfter gameId={gameId} snapshotId={snapshotId} />;
      default:
        return (
          <div className="text-black text-2xl">Game is not defined yet</div>
        );
    }
  };
  //priamouholnik
  return (
    <SpecificGamePage>
      <section className="w-full h-full flex justify-center items-center">
        {getCorrectGameComponent()}
      </section>
    </SpecificGamePage>
  );
};

export default GameHolder;
