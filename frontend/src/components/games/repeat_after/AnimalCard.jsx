import React from "react";
import { previewUrl } from "../../../utils/pendingMedia";

const barToneFor = (score) => {
  if (score < 30) return "bg-danger";
  if (score < 80) return "bg-gradient-to-r from-danger via-accent to-yellow";
  return "bg-gradient-to-r from-danger via-yellow to-success";
};

const AnimalCard = ({ gameData, currentScore }) => {
  const animalImage = previewUrl(gameData?.animal_image_url);

  return (
    <div
      className="
        relative w-full max-w-[40rem]
        rounded-3xl surface-glass bg-white/20 border-white/30 shadow-card
        flex flex-col sm:flex-row items-center
        p-[clamp(1rem,3vw,2rem)] gap-[clamp(1rem,3vw,2rem)]
      "
    >
      <div className="flex flex-1 items-center justify-center">
        {animalImage && (
          <img
            src={animalImage}
            alt=""
            className="max-h-[clamp(8rem,30vw,15rem)] w-auto object-contain drop-shadow-lg"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 justify-center gap-3 w-full">
        <h2 className="text-fluid-4xl font-semibold text-text">
          Ako hovorí {gameData?.animal_name}?
        </h2>

        <div className="text-fluid-5xl font-bold text-text">
          {gameData?.display_text}
        </div>

        <div className="text-fluid-2xl font-semibold text-text">
          {currentScore}/100%
        </div>

        <div className="w-full h-3.5 bg-white/40 rounded-full overflow-hidden">
          <div
            className={`h-full ${barToneFor(currentScore)} transition-all duration-500`}
            style={{ width: `${currentScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
