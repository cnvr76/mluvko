import React from "react";

const PersonalDetails = ({ data }) => {
  return (
    <div className="flex flex-col gap-3 col-span-2">
      {Object.keys(data).map((key, index) => (
        <span key={index}>{data[key]}</span>
      ))}
    </div>
  );
};

export default PersonalDetails;
