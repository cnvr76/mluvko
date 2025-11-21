import React from "react";
import { useParams } from "react-router-dom";
import Pexeso from "./pexeso/Pexeso";
import RepeatAfter from "./repeat_after/RepeatAfter";
import { GameTypes } from "../../services/api";
import SpecificGamePage from "../../pages/SpecificGamePage";

const GameHolder = () => {
  const { gameId, gameType } = useParams();

  const getCorrectGameComponent = () => {
    switch (gameType) {
      case GameTypes.PEXESO:
        return <Pexeso gameId={gameId} />;
      case GameTypes.REPEAT_AFTER:
        return <RepeatAfter gameId={gameId} />;
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
