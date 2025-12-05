import React from "react";
import ReactFlipCard from "react-card-flip";

const FlipCard = ({ data, isFlipped, onClick }) => {
  return (
    <ReactFlipCard isFlipped={isFlipped} flipDirection="horizontal">
      <div
        className="relative md:w-[150px] aspect-[3/4]
        rounded-3xl p-4 bg-blue-400 cursor-pointer"
        onClick={onClick}
      ></div>

      <div
        className="
        relative md:w-[150px] aspect-[3/4]
        rounded-3xl p-4
        bg-white/20
        backdrop-blur-xl
        shadow-[0_10px_30px_rgba(0,0,0,0.2)]
        select-none flex flex-col items-center justify-between"
      >
        <div className="w-[90%] aspect-square overflow-hidden rounded-2xl mt-4">
          <img
            src={data.animal_image_url}
            alt="Flip Card"
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-white text-xl font-semibold mb-6 drop-shadow-md text-center">
          {data.animal_name}
        </p>
      </div>
    </ReactFlipCard>
  );
};

export default FlipCard;
