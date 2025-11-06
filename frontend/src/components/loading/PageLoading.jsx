import React from "react";

const PageLoading = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-100 bg-white flex justify-center items-center">
      <img src="/gifs/loading.gif" alt="loading..." className="w-[20%]" />
    </div>
  );
};

export default PageLoading;
