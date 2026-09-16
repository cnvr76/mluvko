import React from "react";
import RoundIconButton from "../RoundIconButton";
import useAudioRecorder from "../../../hooks/useAudioRecorder";
import { RECORD_AUDIO_ICON } from "../../../constants/media";

const RecordAudioButton = ({ onFinish, isLoading, disabled = false }) => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const handleRecording = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      const audioBlob = await stopRecording();
      if (!audioBlob) return;
      await onFinish(audioBlob);
    }
  };

  const label = isLoading
    ? "Analyzuje sa..."
    : isRecording
      ? "Zastaviť nahrávanie"
      : "Nahrať";

  return (
    <RoundIconButton
      icon={RECORD_AUDIO_ICON}
      label={label}
      onClick={handleRecording}
      disabled={isLoading || (disabled && !isRecording)}
      tone={isRecording ? "recording" : "glass"}
    >
      {isLoading ? (
        <i
          className="fa-solid fa-spinner fa-spin text-fluid-3xl text-text"
          aria-hidden="true"
        />
      ) : undefined}
    </RoundIconButton>
  );
};

export default RecordAudioButton;
