import React from "react";

const AnimalCard = ({ gameData, currentScore }) => {
  let barGradient = "";

  if (currentScore < 30) {
    barGradient = "bg-red-500";
  } else if (currentScore < 80) {
    barGradient = "bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400";
  } else {
    barGradient = "bg-gradient-to-r from-red-500 via-yellow-400 to-green-400";
  }

  return (
    <div
      className="
      mt-5
      relative
      w-full
      max-w-[650px]         
      rounded-3xl
      bg-white/20
      backdrop-blur-xl
      border border-white/30
      shadow-[0_10px_30px_rgba(0,0,0,0.2)]
      flex flex-col md:flex-row
      px-4 md:px-8          
      py-4 md:py-6
      gap-4 md:gap-8
      "
    >
      <div className="flex items-center justify-center md:justify-start flex-1">
        <img
          src={gameData?.animal_image_url}
          alt={gameData?.animal_name}
          className="h-32 md:h-60 object-contain drop-shadow-lg"
        />
      </div>

      <div className="flex flex-col flex-1 justify-center gap-3 md:gap-4">
        <h2 className="text-2xl md:text-4xl font-semibold text-[#642f37]">
          Ako hovorí {gameData?.animal_name}?
        </h2>

        <div className="text-3xl md:text-5xl font-bold text-[#642f37]">
          {gameData?.display_text}
        </div>

        <div className="text-lg md:text-2xl font-semibold text-[#642f37]">
          {currentScore}/100%
        </div>

        <div className="w-full h-3 md:h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={`h-full ${barGradient} transition-all duration-500`}
            style={{ width: `${currentScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
