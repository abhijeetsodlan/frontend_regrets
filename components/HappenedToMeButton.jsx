// src/components/HappenedToMeButton.jsx
import React from "react";

const HappenedToMeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center bg-rose-400 border border-rose-500 text-white p-2 mb-2 rounded-lg"
    >
      Happened to me!
    </button>
  );
};

export default HappenedToMeButton;
