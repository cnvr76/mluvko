import React, { useEffect, useRef, useState } from "react";

const PlayAudioButton = ({ referenceAudioLink }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playAudio = () => {
    stopCurrentAudio();

    const audio = new Audio(referenceAudioLink);
    audioRef.current = audio;

    setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.play().catch((error) => {
      console.error(error);
      setIsPlaying(false);
    });
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    playAudio();
    return () => stopCurrentAudio();
  }, [referenceAudioLink]);

  return (
    <button
      disabled={isPlaying}
      onClick={playAudio}
      className="
      w-14 h-14 md:w-20 md:h-20
      rounded-full
      bg-white/30
      backdrop-blur-xl
      border border-white/40
      shadow-[0_4px_20px_rgba(0,0,0,0.15)]
      flex items-center justify-center
      transition-all duration-200
      hover:scale-105 active:scale-95 cursor-pointer
      "
    >
      <img
        src="/images/icons/PlayAudioButton.png"
        alt="play audio"
        className="w-10 h-10 md:w-10 md:h-10 object-contain"
      />
    </button>
  );
};

export default PlayAudioButton;
