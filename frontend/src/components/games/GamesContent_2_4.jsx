import React from "react";
import { Link } from "react-router-dom";

const GamesContent_2_4 = () => {
  const cards = [
    {
      id: 1,
      title: "Povedz ako zvieratko",
      image: "/images/card_povedz_ako_zvieratko.png",
    },
    { id: 2, title: "Hra2", image: "/images/card.png" },
    { id: 3, title: "Hra3", image: "/images/card.png" },
  ];

  return (
    <div
      className="
        fixed top-0 left-0 w-screen h-screen
        bg-[url('/images/gamepage_2_4_background.png')]
        bg-cover bg-no-repeat bg-center
        flex flex-col items-center justify-center
      "
    >
      <div
        className="
          grid gap-8 md:gap-12
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3
          place-items-center
          z-10
        "
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="
              relative w-[220px] md:w-[260px] aspect-[3/4]
              rounded-3xl p-4
              bg-white/20
              backdrop-blur-xl
              border border-white/30
              shadow-[0_10px_30px_rgba(0,0,0,0.2)]
              transition-transform duration-200 ease-out
              hover:-translate-y-1
              flex flex-col items-center justify-between
            "
          >
            <div className="w-[90%] aspect-square overflow-hidden rounded-2xl mt-4">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-white text-xl font-semibold mb-6 drop-shadow-md text-center">
              {card.title}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center mt-10 translate-y-12 space-y-4 relative z-20">
        <h2 className="text-xl md:text-5xl font-extrabold text-white drop-shadow">
          Vyber si hru
        </h2>

        <Link
          to="/"
          className="
           px-6 py-2 rounded-full
           bg-white/30 font-semibold text-lg
           backdrop-blur-lg border border-white/40
           no-underline transition-colors duration-300 hover:bg-white/40 hover:scale-105
           !text-[#642f37] visited:!text-[#642f37] hover:!text-[#ff7110] visited:hover:!text-[#ff7110]"
        >
          Alebo späť
        </Link>
      </div>
    </div>
  );
};

export default GamesContent_2_4;
