import React from "react";
import useAudioRecorder from "../../../hooks/useAudioRecorder";
import { makePending, PENDING_AUDIO } from "../../../utils/pendingMedia";
import { actionButtonClass } from "../../shared/actionButtonClass";

const RecordAudioField = ({ onAudioChange }) => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const handleClick = async () => {
    if (!isRecording) {
      await startRecording();
      return;
    }

    const blob = await stopRecording();
    if (!blob) return;

    const file = new File([blob], `recording-${Date.now()}.webm`, {
      type: "audio/webm",
    });
    onAudioChange(makePending(file, PENDING_AUDIO));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isRecording ? "Zastaviť nahrávanie" : "Nahrať z mikrofónu"}
      title={isRecording ? "Zastaviť nahrávanie" : "Nahrať z mikrofónu"}
      className={`${actionButtonClass(isRecording ? "danger" : "lavender")} ${
        isRecording ? "animate-pulse" : ""
      }`}
    >
      <i
        className={`fa-solid ${isRecording ? "fa-stop" : "fa-microphone"} fa-fw`}
        aria-hidden="true"
      />
    </button>
  );
};

export default RecordAudioField;
