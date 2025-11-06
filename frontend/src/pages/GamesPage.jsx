import React from "react";
import GamesSelectionSection from "../components/games/GamesSelectionSection";
import Header from "../components/shared/Header";
import GameCardLoader from "../components/games/GameCardLoader";

const GamesPage = ({ ageGroup }) => {
  return (
    <>
      <Header fixed />
      <GamesSelectionSection
        backgroundImage={"/images/gamepage_2_4_background.png"} // TODO - changes depending on the age group (or may be changed)
        // "/images/gamepage_5_6_background.png"
      >
        <GameCardLoader ageGroup={ageGroup} />
      </GamesSelectionSection>
    </>
  );
};

export default GamesPage;
