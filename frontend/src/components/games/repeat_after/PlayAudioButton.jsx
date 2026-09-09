import React, { useEffect, useRef, useState } from "react";
import { PLAY_AUDIO_ICON } from "../../../constants/media";

const PlayAudioButton = ({ referenceAudioLink }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Keyed on the clip, not on the render: re-running this on every render kept
  // aborting the in-flight fetch of the audio file.
  useEffect(() => {
    if (!referenceAudioLink) return;

    const audio = new Audio(referenceAudioLink);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);

    setIsPlaying(true);
    audio.play().catch((error) => {
      setIsPlaying(false);
      // pause() below rejects a play() that is still starting up.
      if (error.name !== "AbortError") console.error(error);
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [referenceAudioLink]);

  const replayAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setIsPlaying(true);
    audio.play().catch((error) => {
      setIsPlaying(false);
      console.error(error);
    });
  };

  return (
    <button
      disabled={isPlaying}
      onClick={replayAudio}
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
        src={PLAY_AUDIO_ICON}
        alt="play audio"
        className="w-10 h-10 md:w-10 md:h-10 object-contain"
      />
    </button>
  );
};

export default PlayAudioButton;
