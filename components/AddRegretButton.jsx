import React from "react";
import { FaPlus } from "react-icons/fa";

const AddRegretButton = ({ onClick, variant = "default" }) => {
  if (variant === "fixed") {
    return (
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
        onClick={onClick}
      >
        <FaPlus size={24} className="text-white" />
      </button>
    );
  }

  return (
    <button
      className="mb-4 bg-gradient-to-r from-red-400 to-red-500 px-6 py-3 rounded-xl shadow hover:scale-105 transition-transform text-white font-bold"
      onClick={onClick}
    >
      + Add Regret
    </button>
  );
};

export default AddRegretButton;
