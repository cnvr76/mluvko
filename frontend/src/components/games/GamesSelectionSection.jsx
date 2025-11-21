import React from "react";
import { Link } from "react-router-dom";

const GamesSelectionSection = ({ children, backgroundImage }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-cover bg-no-repeat bg-center
        flex flex-col items-center justify-center flex-grow overflow-y-auto p-3
      `}
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {children}
      </div>

      <div className="flex flex-col items-center mt-10 translate-y-12 space-y-4 relative z-20">
        <h2 className="text-xl md:text-5xl font-extrabold text-white drop-shadow">
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
