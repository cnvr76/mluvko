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

const ProfilePage = () => {
  const { data: me, isLoading } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: api.users.me,
  });
  const { isTherapist, isAdmin } = useAuth();
  const [requestedTab, setRequestedTab] = useQueryState("tab", {
    defaultValue: "details",
  });

  if (isLoading || !me) return <PageLoading />;

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
    <main
      className="
        w-full h-screen
        bg-cover bg-no-repeat bg-center
        px-4 pt-28 pb-12
        
      "
      style={{
        backgroundImage: "url('/images/background.png')",
      }}
    >
      <div
        className="
          w-full max-w-6xl mx-auto
          h-[78vh]
          rounded-[2rem]
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_30px_rgba(0,0,0,0.18)]
          p-5 md:p-8
          grid grid-cols-1 md:grid-cols-[260px_1fr]
          gap-6
          text-[#642f37]
          overflow-hidden
          items-start
          
        "
      >
        <nav
          className="
            flex flex-col gap-3
            md:border-r md:border-white/40
            md:pr-6
            sticky top-0 self-start
          "
        >
          {tabsConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRequestedTab(tab.id)}
              className={`
                cursor-pointer
                text-2xl
                text-left
                px-5 py-3
                rounded-full
                font-semibold
                transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "bg-white/50 shadow-[0_4px_15px_rgba(0,0,0,0.12)] text-[#ff7110]"
                    : "bg-white/20 hover:bg-white/40"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section
          className="
            h-full
            overflow-y-auto
            px-8
            pb-10
          "
        >
          {activeComponent}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
