import React, { useEffect, useRef, useState } from "react";
import { FaHeartBroken } from "react-icons/fa";

const LikeButton = ({ questionId, likes, handleLike }) => {
  const liked = Boolean(likes[questionId]?.liked);
  const count = likes[questionId]?.count || 0;
  const [iconScale, setIconScale] = useState(1);
  const animTimeoutRef = useRef(null);

  const triggerLikeAnimation = () => {
    if (animTimeoutRef.current) {
      clearTimeout(animTimeoutRef.current);
    }
    setIconScale(1.3);
    animTimeoutRef.current = setTimeout(() => {
      setIconScale(1);
      animTimeoutRef.current = null;
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={(e) => {
        if (!liked) {
          triggerLikeAnimation();
        }
        handleLike(e, questionId);
      }}
      aria-label={`Likes ${count}`}
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-medium transition ${
        liked
          ? "border-rose-300/40 bg-rose-500/15 text-rose-200"
          : "border-white/10 bg-slate-900/55 text-slate-300 hover:border-white/20 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <FaHeartBroken
        size={14}
        className={liked ? "text-rose-300" : ""}
        style={{ transform: `scale(${iconScale})`, transition: "transform 220ms ease" }}
      />
      <span className="text-xs font-semibold tabular-nums sm:text-sm">{count}</span>
    </button>
  );
};

export default LikeButton;
