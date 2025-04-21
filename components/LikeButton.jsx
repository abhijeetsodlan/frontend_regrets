import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ questionId, likes, handleLike }) => {
  return (
    <button
      onClick={(e) => handleLike(e, questionId)}
      className="flex items-center px-3 py-2 text-white rounded-md hover:bg-gray-700 transition"
    >
      {likes[questionId]?.liked ? (
        <FaHeart size={16} className="mr-1 text-red-500" />
      ) : (
        <FaRegHeart size={16} className="mr-1" />
      )}
      <span className="text-sm">{likes[questionId]?.count || 0}</span>
    </button>
  );
};

export default LikeButton;
