import React from "react";
import ReactFlipCard from "react-card-flip";

const FlipCard = ({ data, isFlipped, onClick }) => {
  return (
    <ReactFlipCard isFlipped={isFlipped} flipDirection="horizontal">
      <div
        className="relative md:w-[150px] aspect-[3/4]
        rounded-3xl bg-blue-400 cursor-pointer"
        onClick={onClick}
      ></div>

      <div
        className="
        relative md:w-[150px] aspect-[3/4]
        rounded-3xl
        bg-white/20
        backdrop-blur-xl
        shadow-[0_10px_30px_rgba(0,0,0,0.2)]
        select-none flex flex-col items-center justify-between"
      >
        <img
          src={data.animal_image_url}
          alt="Flip Card"
          className="w-full h-full object-fit"
        />

        <p className="absolute bottom-[-16px] text-black text-2xl font-semibold mb-6 text-shadow-amber-50 text-shadow-sm text-center">
          {data.animal_name}
        </p>
      </div>
    </ReactFlipCard>
  );
};

export default FlipCard;
