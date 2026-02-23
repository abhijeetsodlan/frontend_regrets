import React from "react";
import { FaRegCommentDots } from "react-icons/fa";

const CommentButton = ({ questionId, onNavigate, repliesCount = 0 }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onNavigate(`/regrets/${questionId}`);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Replies ${repliesCount || 0}`}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/55 hover:border-white/20 hover:bg-slate-800 hover:text-white">
        <FaRegCommentDots size={14} />
      </span>
      <span className="text-xs font-semibold tabular-nums text-slate-300 sm:text-sm">{repliesCount || 0}</span>
    </button>
  );
};

export default CommentButton;
