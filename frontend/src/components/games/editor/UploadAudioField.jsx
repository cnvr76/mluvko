import React, { useRef } from "react";
import { makePending, PENDING_AUDIO } from "../../../utils/pendingMedia";
import { actionButtonClass } from "../../shared/actionButtonClass";

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
        aria-label="Nahrať zvuk zo súboru"
        title="Nahrať zvuk zo súboru"
        className={actionButtonClass("blue")}
      >
        <i className="fa-solid fa-folder-open fa-fw" aria-hidden="true" />
      </button>
    </>
  );
};

export default UploadAudioField;
