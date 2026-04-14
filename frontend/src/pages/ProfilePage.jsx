import React from "react";
import { useLoaderData } from "react-router-dom";
import { api } from "../services/api";

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
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col gap-3">
        {Object.keys(me).map((key, index) => (
          <span key={index}>{me[key]}</span>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
