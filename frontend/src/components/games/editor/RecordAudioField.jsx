import React from "react";
import useAudioRecorder from "../../../hooks/useAudioRecorder";
import { makePending, PENDING_AUDIO } from "../../../utils/pendingMedia";

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
      className={`
        px-3 py-1.5
        rounded-xl
        text-white
        text-sm font-semibold
        transition-all duration-200
        ${
          isRecording
            ? "bg-[#d62828] hover:bg-[#b81f1f]"
            : "bg-[#B89DBB] hover:bg-[#a489a7]"
        }
      `}
    >
      {isRecording ? "Zastaviť" : <i className="fa-solid fa-microphone"></i>}
    </button>
  );
};

export default RecordAudioField;
