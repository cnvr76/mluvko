import React from "react";
import { Link } from "react-router-dom";

const GamesSelectionSection = ({ children, backgroundImage }) => {
  const hasGames = React.Children.count(children) > 0;

  return (
    <div
      className="
        relative isolate
        w-full min-h-dvh
        flex flex-col items-center gap-8
        pt-page-top pb-10 px-3
      "
    >
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />

      <div className="flex-1 w-full flex items-center justify-center">
        {hasGames ? (
          <div
            className="
              w-full max-w-[52rem]
              grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))]
              gap-8 justify-items-center
            "
          >
            {children}
          </div>
        ) : (
          <p
            className="
              surface-glass rounded-panel
              max-w-md px-8 py-10
              text-center text-fluid-xl font-semibold text-text
            "
          >
            Pre túto vekovú skupinu zatiaľ nemáme žiadne hry.
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <h2 className="text-fluid-5xl font-extrabold text-white drop-shadow text-center">
          Vyber si hru
        </h2>

        <Link
          to="/"
          className="
            btn-pill surface-glass
            text-fluid-xl text-text
            hover:bg-white/40 hover:text-accent
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          "
        >
          Alebo späť
        </Link>
      </div>
    </div>
  );
};

export default GamesSelectionSection;
