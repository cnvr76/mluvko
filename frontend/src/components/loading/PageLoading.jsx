import React from "react";

const PageLoading = () => {
  return (
    <>
      <style>{`
        @keyframes duck-walk {
          0% { transform: translateX(0); }
          100% { transform: translateX(220px); }
        }

        @keyframes duck-enter {
          0% {
            transform: translateY(20px) scale(0.7);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .loading-duck {
          position: absolute;
          bottom: 25px;          
          left: 0;
          width: 48px;
          height: 48px;
          object-fit: contain;

          
          animation:
            duck-enter 0.6s ease-out forwards,
            duck-walk 3s linear infinite;

          
          opacity: 0;
        }

        .loading-duck-1 {
          animation-delay: 0s, 0s; /* вход 0s, ходьба 0s */
        }
        .loading-duck-2 {
          animation-delay: 0.8s, 1.0s; /* вход 0.4s позже */
        }
        .loading-duck-3 {
          animation-delay: 1.6s, 2.0s; /* вход 0.8s позже */
        }
      `}</style>

      <div
        className="
          fixed top-0 left-0 w-screen h-screen
          flex flex-col items-center justify-center
          bg-[#9fdcff]
        "
      >
        <div className="relative w-72 h-24">
          <div className="absolute bottom-6 w-64 h-2 rounded-full bg-[#1f0a94]" />

          <img
            src="/images/duck.png"
            alt="duck"
            className="loading-duck loading-duck-1"
          />
          <img
            src="/images/duck.png"
            alt="duck"
            className="loading-duck loading-duck-2"
          />
          <img
            src="/images/duck.png"
            alt="duck"
            className="loading-duck loading-duck-3"
          />
        </div>

        <p className="mt-6 text-white text-2xl font-semibold tracking-[0.3em]">
          Loading...
        </p>
      </div>
    </>
  );
};

export default PageLoading;
