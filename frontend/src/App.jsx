import { useMemo } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GuestRoute } from "./components/auth/GuestRoute";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import GameHolder from "./components/games/GameHolder";
import PageLoading from "./components/loading/PageLoading";
import Layout from "./components/shared/Layout";
import { useAuth } from "./contexts/AuthContext";
import AuthForm from "./pages/AuthForm";
import GamesPage from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import ProfilePage, { profileLoader } from "./pages/ProfilePage";
import { AgeGroups } from "./services/api";

const createRoutes = () =>
  createBrowserRouter([
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
    return createRoutes();
  }, [isLoading]);

  if (isLoading) {
    return <PageLoading />;
  }

  return <RouterProvider router={router} />;
}

export default App;
