import { useMemo } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GuestRoute } from "./components/auth/GuestRoute";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import GameHolder from "./components/games/GameHolder";
import PageLoading from "./components/loading/PageLoading";
import Layout from "./components/shared/Layout";
import { useAuth } from "./contexts/AuthContext";
import AuthForm from "./pages/AuthForm";
import GamesPage, { gamesLoaderFactory } from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import ProfilePage, { profileLoader } from "./pages/ProfilePage";
import { AgeGroups } from "./services/api";
import GameEditPage from "./components/games/editor/GameEditPage";

const browserRouter = createBrowserRouter([
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
            element: <GamesPage />,
            loader: gamesLoaderFactory(AgeGroups.JUNIOR),
          },
          {
            path: "5-6",
            element: <GamesPage />,
            loader: gamesLoaderFactory(AgeGroups.MIDDLE),
          },
          {
            path: ":gameId/edit",
            element: (
              <ProtectedRoute>
                <GameEditPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ":gameId/:gameType",
            element: <GameHolder />,
          },
        ],
      },
      {
        path: "auth",
        element: (
          <GuestRoute>
            <AuthForm />
          </GuestRoute>
        ),
      },
      {
        path: "profile",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
            loader: profileLoader,
          },
          {},
        ],
      },
    ],
  },
]);

function App() {
  const { isLoading } = useAuth();

  const router = useMemo(() => {
    if (isLoading) return null;
    return browserRouter;
  }, [isLoading]);

  if (isLoading) return <PageLoading />;

  return <RouterProvider router={router} fallbackElement={<PageLoading />} />;
}

export default App;
