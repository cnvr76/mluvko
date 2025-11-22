import React from "react";
import GamesSelectionSection from "../components/games/GamesSelectionSection";
import Header from "../components/shared/Header";
import GameCardLoader from "../components/games/GameCardLoader";

import { AgeGroups } from "../services/api";

const GamesPage = ({ ageGroup }) => {
  console.log("AGE GROUP =", ageGroup);

  const backgroundImage =
    ageGroup === AgeGroups.JUNIOR
      ? "/images/gamepage_2_4_background.png"
      : "/images/gamepage_5_6_background.png";

  return (
    <>
      <Header />

      <GamesSelectionSection backgroundImage={backgroundImage}>
        <GameCardLoader ageGroup={ageGroup} />
      </GamesSelectionSection>
    </>
  );
};

export default GamesPage;
