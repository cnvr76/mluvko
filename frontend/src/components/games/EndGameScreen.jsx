import React from "react";
import { Link } from "react-router-dom";

const EndGameScreen = ({ currentScore, bestScore }) => {
  return (
    <section className="flex flex-col justify-center items-center text-center  text-text">
      <h1 className="text-4xl font-bold mb-10">Ďakujeme za hru!</h1>

      <div className="text-2xl flex flex-col gap-2 mb-10">
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
          px-15 py-5
          rounded-full
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-control
          font-semibold text-2xl
          no-underline
          text-text

          transition-all duration-200
          hover:scale-105
          active:scale-95
          hover:bg-white/40

          hover:text-accent
        "
      >
        Späť na hry
      </Link>
    </section>
  );
};

export default EndGameScreen;
