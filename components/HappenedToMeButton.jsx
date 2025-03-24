// src/components/HappenedToMeButton.jsx
import React from "react";

const HappenedToMeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center bg-red-400 border border-red-500 text-white p-2 mb-2 rounded-lg"
    >
      Happened to me!
    </button>
  );
};

export default HappenedToMeButton;