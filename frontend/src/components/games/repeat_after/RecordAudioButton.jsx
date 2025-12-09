import useAudioRecorder from "../../../hooks/useAudioRecorder";

const RecordAudioButton = ({ onFinish, isLoading }) => {
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

  return (
    <button
      onClick={handleRecording}
      disabled={isLoading}
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
      {isRecording && <div>is recording</div>}
      {!isLoading ? (
        <img
          src="/images/icons/RecordAudioButton.png"
          alt={isRecording ? "Stop Recording" : "Start Recording"}
          className="w-10 h-10 md:w-10 md:h-10 object-contain"
        />
      ) : (
        <div className="">Analysing...</div>
      )}
    </button>
  );
};

export default RecordAudioButton;
