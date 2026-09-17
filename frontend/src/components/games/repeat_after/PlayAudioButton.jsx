import React, { useEffect, useRef, useState } from "react";
import RoundIconButton from "../RoundIconButton";
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
    <RoundIconButton
      icon={PLAY_AUDIO_ICON}
      label="Prehrať zvuk"
      onClick={replayAudio}
      disabled={isPlaying}
    />
  );
};

export default PlayAudioButton;
