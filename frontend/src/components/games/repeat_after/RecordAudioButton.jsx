const RecordAudioButton = ({ referenceText }) => {
  return (
    <button
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
      <img
        src="/images/RecordAudioButton.png"
        alt="play audio"
        className="w-15 h-15 object-contain"
      />
    </button>
  );
};

export default RecordAudioButton;
