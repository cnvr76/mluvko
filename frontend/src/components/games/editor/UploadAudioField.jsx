import React, { useRef } from "react";
import { makePending, PENDING_AUDIO } from "../../../utils/pendingMedia";

const UploadAudioField = ({ onAudioChange }) => {
  const inputRef = useRef(null);

  const handleSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    onAudioChange(makePending(file, PENDING_AUDIO));
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.webm,.m4a"
        onChange={handleSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="
          px-3 py-1.5
          rounded-xl
          bg-[#9DBBD8]
          hover:bg-[#88a9c9]
          text-white
          text-sm font-semibold
          transition-all duration-200
        "
      >
        <i class="fa-solid fa-folder-open"></i>
      </button>
    </>
  );
};

export default UploadAudioField;
