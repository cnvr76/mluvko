import React from "react";
import { useNavigate } from "react-router-dom";

const HomeContent = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed top-0 left-0 w-screen h-screen
        bg-[url('/images/homepage_background.png')]
        bg-cover bg-no-repeat bg-center
      "
    >
      {/*МОБИЛКА*/}
      <div
        className="flex md:hidden flex-col items-center
    gap-10
    mt-4
    pt-50"
      >
        <img
          src="/images/button_2_4_years.png"
          alt="Hry pre deti 2-4 roky"
          onClick={() => navigate("/games-2-4")}
          className="
          w-[300px] sm:w-[500px] h-auto
          cursor-pointer
          transition-transform duration-200 ease-out
          hover:scale-110"
        />

        <img
          src="/images/button_5_6_years.png"
          alt="Hry pre deti 5-6 rokov"
          onClick={() => navigate("/games-5-6")}
          className="
          w-[300px] sm:w-[500px] h-auto
          cursor-pointer
          transition-transform duration-200 ease-out
          hover:scale-110"
        />
      </div>

      {/*ДЕСКТОП*/}
      <img
        src="/images/button_2_4_years.png"
        alt="Hry pre deti 2-4 roky"
        onClick={() => navigate("/games-2-4")}
        className="
          hidden md:block
          absolute top-[36%] left-[18%]
          w-[380px] h-auto
          cursor-pointer z-10
          transition-transform duration-200 ease-out
          hover:scale-110
        "
      />

      <img
        src="/images/button_5_6_years.png"
        alt="Hry pre deti 5-6 roky"
        onClick={() => navigate("/games-5-6")}
        className="
          hidden md:block
          absolute top-[20%] left-[45%]
          w-[380px] h-auto
          cursor-pointer z-10
          transition-transform duration-200 ease-out
          hover:scale-110
        "
      />
    </div>
  );
};

export default HomeContent;
