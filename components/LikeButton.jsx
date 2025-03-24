// src/components/LikeButton.jsx
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ questionId, likes, handleLike }) => {
  return (
    <button
      onClick={(e) => handleLike(e, questionId)}
      className="flex items-center border text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition hover:bg-gray-800"
    >
      {likes[questionId]?.liked ? (
        <FaHeart size={16} className="mr-1 text-red-500" />
      ) : (
        <FaRegHeart size={16} className="mr-1" />
      )}
      <span className="text-sm sm:text-base">
        {likes[questionId]?.count || 0}
      </span>
    </button>
  );
};

export default LikeButton;