    // src/components/CommentButton.jsx
import React from "react";
import { FaRegComment } from "react-icons/fa";

const CommentButton = ({ questionId, onNavigate }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    onNavigate(`/regrets/${questionId}`); // Call the navigation function
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center border px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition hover:bg-gray-800"
    >
      <FaRegComment size={16} className="mr-1 text-white" />
    </button>
  );
};

export default CommentButton;