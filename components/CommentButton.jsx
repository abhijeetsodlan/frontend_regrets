import React from "react";
import { FaRegComment } from "react-icons/fa";

const CommentButton = ({ questionId, onNavigate }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onNavigate(`/regrets/${questionId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center px-3 py-2 rounded-md text-white hover:bg-gray-600 transition"
    >
      <FaRegComment size={16} className="mr-1" />
    </button>
  );
};

export default CommentButton;
