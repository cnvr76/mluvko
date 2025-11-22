import React from "react";
import { Link } from "react-router-dom";

const EndGameScreen = ({ currentScore, bestScore }) => {
  return (
    <section className="flex flex-col justify-center items-center text-center mt-20  text-[#642f37]">
      <h1 className="text-4xl font-bold mb-6">Ďakujeme za hru!</h1>

      <div className="text-2xl flex flex-col gap-2 mb-10">
        <span>
          Aktuálny výsledok: <strong>{currentScore}</strong>
        </span>
        <span>
          Najlepší výsledok: <strong>{bestScore}</strong>
        </span>
      </div>

      <Link
        to="/games-2-4"
        className="
          px-15 py-5
          rounded-full
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          font-semibold text-2xl
          no-underline
          text-[#642f37]

          transition-all duration-200
          hover:scale-105
          active:scale-95
          hover:bg-white/40

          hover:text-[#ff7110]
        "
      >
        Späť na hry
      </Link>
    </section>
  );
};

export default EndGameScreen;
