import React, { useState } from "react";
import { useLoaderData, redirect } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import PersonalDetails from "../components/profile/PersonalDetails";
import FavoriteGames from "../components/profile/FavoriteGames";

export const profileLoader = async () => {
  try {
    const data = await api.getMyProfile();
    return data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return redirect("/auth?type=login");
    }
    throw error;
  }
};

// TODO - сделать нормальный дизайн для показа личной инфы пользователя
/* 
    в виде form желательно, чтобы можно было сделать после
    еще и обновление дат здесь же по нажатию на кнопку "Обновить",
    которая будет активной после какого либо изменения
*/
const ProfilePage = () => {
  const me = useLoaderData();
  const { isTherapist, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("details");

  const tabsConfig = [
    {
      id: "details",
      label: "Profile details",
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
      label: "Moje vytvorené hry",
      // component: <CreatedGames />,
    });
  }

  if (isAdmin) {
    tabsConfig.push({
      id: "admin",
      label: "Admin dashboard",
      // component: <AdminDashboard />,
    });
  }

  const activeComponent = tabsConfig.find(
    (tab) => tab.id === activeTab
  )?.component;

  return (
    <div className="w-full min-h-screen grid grid-cols-3 gap-4 p-8 pt-24 md:pt-32">
      {/* TAB NAVIGATION */}
      <nav className="flex flex-col gap-3 border-r pr-4">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer text-left p-2 rounded ${
              activeTab === tab.id
                ? "bg-gray-200 font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <div className="col-span-2">{activeComponent}</div>
    </div>
  );
};

export default ProfilePage;
