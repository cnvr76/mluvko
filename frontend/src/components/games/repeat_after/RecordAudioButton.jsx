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
        w-25 h-25
        rounded-full
        bg-white/30
        backdrop-blur-xl
        border border-white/40
        shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        flex items-center justify-center
        transition-all duration-200
        hover:scale-105
        active:scale-95
      "
    >
      {isRecording && <div>is recording</div>}
      {!isLoading ? (
        <img
          src="/images/RecordAudioButton.png"
          alt={isRecording ? "Stop Recording" : "Start Recording"}
          className="w-15 h-15 object-contain"
        />
      ) : (
        <div className="">Analysing...</div>
      )}
    </button>
  );
};

export default RecordAudioButton;
