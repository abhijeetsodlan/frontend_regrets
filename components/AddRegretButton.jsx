// src/components/AddRegretButton.jsx
import React from "react";
import { FaPlus } from "react-icons/fa";

const AddRegretButton = ({ onClick, variant = "default" }) => {
  if (variant === "fixed") {
    return (
      <button
        className="fixed bottom-6 right-6 bg-red-400 p-4 rounded-full shadow-xl hover:bg-red-500 transition"
        onClick={onClick}
      >
        <FaPlus size={24} className="text-white" />
      </button>
    );
  }

  return (
    <button
      className="mb-4 bg-red-400 px-6 py-3 rounded-lg shadow-md hover:bg-red-500 transition font-semibold text-white"
      onClick={onClick}
    >
      + Add Regret
    </button>
  );
};

export default AddRegretButton;