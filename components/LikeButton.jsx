import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ questionId, likes, handleLike }) => {
  const liked = Boolean(likes[questionId]?.liked);
  const count = likes[questionId]?.count || 0;

  return (
    <button
      onClick={(e) => handleLike(e, questionId)}
      aria-label={`Likes ${count}`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border px-0 text-sm font-medium transition sm:w-auto sm:gap-2 sm:px-3 ${
        liked
          ? "border-rose-300/40 bg-rose-500/15 text-rose-200"
          : "border-white/10 bg-slate-900/55 text-slate-300 hover:border-white/20 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {liked ? <FaHeart size={14} className="text-rose-300" /> : <FaRegHeart size={14} />}
      <span className="hidden sm:inline">{count}</span>
    </button>
  );
};

export default LikeButton;
