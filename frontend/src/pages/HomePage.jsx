import React from "react";
import { Link } from "react-router-dom";
import PageLoading from "../components/loading/PageLoading";
import useMediaReady from "../hooks/useMediaReady";
import {
  HOME_BACKGROUND,
  HOME_JUNIOR_BUTTON,
  HOME_MIDDLE_BUTTON,
} from "../constants/media";

const HOME_MEDIA = [HOME_BACKGROUND, HOME_JUNIOR_BUTTON, HOME_MIDDLE_BUTTON];

const CLOUD_BUTTONS = [
  {
    path: "/games/5-6",
    image: HOME_MIDDLE_BUTTON,
    label: "Hry pre deti 5-6 rokov",
  },
  {
    path: "/games/2-4",
    image: HOME_JUNIOR_BUTTON,
    label: "Hry pre deti 2-4 roky",
  },
];

const HomePage = () => {
  const isMediaReady = useMediaReady(HOME_MEDIA);

  if (!isMediaReady) return <PageLoading />;

  return (
    <main className="relative isolate min-h-dvh flex flex-col items-center px-4 pt-page-top pb-10">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat bg-[position:75%_center]"
        style={{ backgroundImage: `url('${HOME_BACKGROUND}')` }}
      />

      <div className="mt-[4vh] w-full max-w-[52rem] flex flex-col gap-cloud-gap">
        {CLOUD_BUTTONS.map(({ path, image, label }, index) => (
          <Link
            key={path}
            to={path}
            aria-label={label}
            className={`${index % 2 === 0 ? "self-end" : "self-start"} w-cloud-width transition-transform duration-200 ease-out hover:scale-110`}
          >
            <img src={image} alt={label} className="w-full h-auto" />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default HomePage;
