import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Notice from "../shared/Notice";

const EndGameScreen = ({ currentScore, bestScore }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <section className="w-full max-w-md flex flex-col items-center gap-6 text-center text-text px-4">
      <h1 className="text-fluid-4xl font-bold">Ďakujeme za hru!</h1>

      <div className="text-fluid-2xl flex flex-col gap-2">
        <span>
          Aktuálny výsledok: <strong>{currentScore}</strong>
        </span>

        {isAuthenticated && (
          <span>
            Najlepší výsledok: <strong>{bestScore}</strong>
          </span>
        )}
      </div>

      {!isAuthenticated && (
        <div className="w-full flex flex-col items-center gap-4">
          <Notice tone="info">
            Výsledok sa zatiaľ neuložil. Prihláste sa alebo si vytvorte účet a
            uložíme ho k vášmu profilu.
          </Notice>
        </div>
      )}

      <div className="flex flex-col-reverse justify-center gap-4">
        <Link
          to="/"
          className="
            btn-pill surface-glass min-w-fit
            px-10 text-fluid-xl text-text
            hover:bg-white/40 hover:text-accent
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          "
        >
          Späť na hry
        </Link>

        {!isAuthenticated && (
          <Link
            to="/auth?type=login"
            state={{ from: location }}
            className="
            btn-pill bg-accent hover:bg-accent-hover min-w-fit
            px-8 text-fluid-xl text-white font-bold shadow-accent
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          "
          >
            <i
              className="fa-solid fa-right-to-bracket fa-fw"
              aria-hidden="true"
            />
            Prihlásiť sa a uložiť
          </Link>
        )}
      </div>
    </section>
  );
};

export default EndGameScreen;
