import React from "react";
import { Link } from "react-router-dom";

const GamesSelectionSection = ({ children, backgroundImage }) => {
  return (
    <div
      className="
        w-full min-h-screen
        bg-cover bg-no-repeat bg-center
        flex flex-col
        pt-24 pb-32 px-3
      "
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div
          className="
            w-full max-w-6xl
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            gap-8 justify-items-center
          "
        >
          {children}
        </div>
      </div>

      <div
        className="
          fixed bottom-8 left-1/2 -translate-x-1/2
          flex flex-col items-center space-y-2
          z-40
        "
      >
        <h2 className="text-xl md:text-5xl font-extrabold text-white drop-shadow text-center">
          Vyber si hru
        </h2>

        <Link
          to="/"
          className="
            px-6 py-2
            rounded-full
            bg-white/30
            backdrop-blur-xl
            border border-white/40
            shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            font-semibold text-lg
            no-underline
            text-[#642f37]
            transition-all duration-200
            hover:scale-105
            active:scale-95
            hover:bg-white/40
            hover:text-[#ff7110]
          "
        >
          Alebo späť
        </Link>
      </div>
    </div>
  );
};

export default GamesSelectionSection;
