import React from "react";
import { Link } from "react-router-dom";

const EndGameScreen = ({ currentScore, bestScore }) => {
  return (
    <section className="flex flex-col justify-center items-center text-center text-text px-4">
      <h1 className="text-fluid-4xl font-bold mb-8">Ďakujeme za hru!</h1>

      <div className="text-fluid-2xl flex flex-col gap-2 mb-8">
        <span>
          Aktuálny výsledok: <strong>{currentScore}</strong>
        </span>
        <span>
          Najlepší výsledok: <strong>{bestScore}</strong>
        </span>
      </div>

      <Link
        to="/"
        className="
          btn-pill surface-glass
          px-12 py-5
          text-fluid-2xl text-text
          hover:bg-white/40 hover:text-accent
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        "
      >
        Späť na hry
      </Link>
    </section>
  );
};

export default EndGameScreen;
