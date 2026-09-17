import React from "react";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import PageLoading from "../components/loading/PageLoading";
import PersonalDetails from "../components/profile/PersonalDetails";
import FavoriteGames from "../components/profile/FavoriteGames";
import CreatedGames from "../components/profile/CreatedGames";
import AdminDashboard from "../components/profile/AdminDashboard";
import UserManagement from "../components/profile/UserManagement";
import RoleRequests from "../components/profile/RoleRequests";
import useMediaReady from "../hooks/useMediaReady";
import { APP_BACKGROUND } from "../constants/media";

const ProfilePage = () => {
  const { data: me, isLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: api.users.me,
  });
  const { isTherapist, isAdmin } = useAuth();
  const [requestedTab, setRequestedTab] = useQueryState("tab", {
    defaultValue: "details",
  });

  const isMediaReady = useMediaReady([APP_BACKGROUND], !isLoading && !!me);

  if (isLoading || !me || !isMediaReady) return <PageLoading />;

  const tabsConfig = [
    {
      id: "details",
      label: "Profil",
      component: <PersonalDetails data={me} />,
    },
    {
      id: "favorites",
      label: "Obľúbené hry",
      component: <FavoriteGames />,
    },
  ];

  if (isTherapist) {
    tabsConfig.push({
      id: "created",
      label: "Moje hry",
      component: <CreatedGames />,
    });
  }

  if (isAdmin) {
    tabsConfig.push(
      ...[
        {
          id: "admin",
          label: "Admin",
          component: <AdminDashboard />,
        },
        {
          id: "users",
          label: "Používatelia",
          component: <UserManagement currentUserId={me.id} />,
        },
        {
          id: "role-requests",
          label: "Žiadosti o rolu",
          component: <RoleRequests />,
        },
      ],
    );
  }

  const activeTab = tabsConfig.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "details";

  const activeComponent = tabsConfig.find(
    (tab) => tab.id === activeTab,
  )?.component;

  return (
    <main className="relative isolate w-full min-h-dvh px-4 pt-page-top pb-12">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url('${APP_BACKGROUND}')` }}
      />

      <div
        className="
          w-full max-w-6xl mx-auto
          surface-glass rounded-panel shadow-panel-strong
          p-5 md:p-8
          grid grid-cols-1 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]
          gap-6
          text-text
          md:h-[min(78vh,48rem)] md:overflow-hidden
        "
      >
        <nav
          className="
            flex flex-row md:flex-col gap-3
            overflow-x-auto md:overflow-visible
            -mx-1 px-1 pb-1 md:mx-0 md:px-0 md:pb-0
            md:border-r md:border-white/40 md:pr-6
            md:self-start
          "
        >
          {tabsConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRequestedTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`
                shrink-0 whitespace-nowrap
                cursor-pointer
                text-fluid-lg md:text-left
                px-4 py-2.5
                rounded-full
                font-semibold
                transition-all duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
                ${
                  activeTab === tab.id
                    ? "bg-white/50 shadow-panel text-accent"
                    : "bg-white/20 hover:bg-white/40"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="min-w-0 md:overflow-y-auto md:p-5 md:-m-5">
          {activeComponent}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
