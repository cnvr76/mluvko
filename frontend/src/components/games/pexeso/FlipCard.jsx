import React from "react";
import ReactFlipCard from "react-card-flip";

const FlipCard = ({ data, isFlipped, onClick }) => {
  return (
    <ReactFlipCard isFlipped={isFlipped} flipDirection="horizontal">
      <div
        onClick={onClick}
        className="relative w-[96px] sm:w-[120px] md:w-[140px] aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer select-none bg-[#ff7110]"
      >
        <img
          src="/images/pexeso/card_Pexeso.png"
          alt="Card back"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      <div
        onClick={onClick}
        className="relative w-[96px] sm:w-[120px] md:w-[140px] aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer select-none bg-white/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
      >
        <img
          src={data.animal_image_url}
          alt={data.animal_name}
          className="w-full h-full object-cover"
          draggable={false}
        />

        <p
          className="absolute bottom-1 left-1/2 -translate-x-1/2 max-w-[92%]
        px-2 text-center font-semibold sm:text-sm text-white
       [text-shadow:0_2px_6px_rgba(0,0,0,0.85)]"
        >
          {data.animal_name}
        </p>
      </div>
    </ReactFlipCard>
  );
};

export default FlipCard;
