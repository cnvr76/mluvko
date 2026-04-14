import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import { AgeGroups } from "./services/api";
import GameHolder from "./components/games/GameHolder";
import AuthForm from "./pages/AuthForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "games",
        children: [
          {
            path: "2-4",
            element: <GamesPage ageGroup={AgeGroups.JUNIOR} />,
          },
          {
            path: "5-6",
            element: <GamesPage ageGroup={AgeGroups.MIDDLE} />,
          },
          {
            path: ":gameId/:gameType",
            element: <GameHolder />,
          },
        ],
      },
      {
        path: "auth",
        element: <AuthForm />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
