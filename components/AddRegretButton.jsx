import React from "react";
import { FaPlus } from "react-icons/fa";

const AddRegretButton = ({ onClick, variant = "default" }) => {
  if (variant === "fixed") {
    return (
      <>
        <button
          className="fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/40 bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 font-semibold text-white shadow-[0_14px_36px_rgba(239,68,68,0.4)] sm:hidden"
          onClick={onClick}
        >
          <FaPlus size={16} className="text-white" />
          Add Regret
        </button>

        <button
          className="fixed bottom-6 right-6 z-40 hidden rounded-full border border-red-300/40 bg-gradient-to-r from-red-500 to-red-600 p-4 shadow-[0_14px_36px_rgba(239,68,68,0.4)] transition-transform duration-200 hover:scale-105 sm:inline-flex"
          onClick={onClick}
        >
          <FaPlus size={24} className="text-white" />
        </button>
      </>
    );
  }

  return (
    <button
      className="mb-4 rounded-xl border border-red-300/30 bg-gradient-to-r from-red-400 to-red-500 px-6 py-3 font-bold text-white shadow-[0_10px_24px_rgba(239,68,68,0.35)] transition-transform hover:scale-[1.02]"
      onClick={onClick}
    >
      + Add Regret
    </button>
  );
};

export default AddRegretButton;
