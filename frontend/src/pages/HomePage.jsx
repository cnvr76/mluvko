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

const AGE_GROUPS = [
  {
    path: "/games/2-4",
    image: HOME_JUNIOR_BUTTON,
    label: "Hry pre deti 2-4 roky",
    position: "order-2 self-start",
  },
  {
    path: "/games/5-6",
    image: HOME_MIDDLE_BUTTON,
    label: "Hry pre deti 5-6 rokov",
    position: "order-1 self-end",
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

      <div className="mt-[4vh] w-full max-w-[52rem] flex flex-col gap-4 sm:gap-6">
        {AGE_GROUPS.map(({ path, image, label, position }) => (
          <Link
            key={path}
            to={path}
            aria-label={label}
            className={`${position} w-[min(80%,20rem)] transition-transform duration-200 ease-out hover:scale-110`}
          >
            <img src={image} alt={label} className="w-full h-auto" />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default HomePage;
