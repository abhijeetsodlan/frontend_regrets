import React from "react";
import { FaRegCommentDots } from "react-icons/fa";

const CommentButton = ({ questionId, onNavigate }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onNavigate(`/regrets/${questionId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-slate-900/55 px-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-slate-800 hover:text-white"
    >
      <FaRegCommentDots size={14} />
      <span>Reply</span>
    </button>
  );
};

export default CommentButton;

