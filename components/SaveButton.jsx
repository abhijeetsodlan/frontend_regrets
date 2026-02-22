import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { saveQuestion } from "../src/services/questionService";

const SaveButton = ({ questionId, initiallySaved = false, onRequireAuth }) => {
  const [isSaved, setIsSaved] = useState(Boolean(initiallySaved));
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("auth_token") || "";
  const storedEmail = localStorage.getItem("useremail") || "";

  useEffect(() => {
    setIsSaved(Boolean(initiallySaved));
  }, [initiallySaved]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    if (!token) {
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }

    setLoading(true);
    try {
      const data = await saveQuestion(questionId, { token, email: storedEmail });
      if (typeof data?.saved === "boolean") {
        setIsSaved(data.saved);
      }
    } catch {
      // Silent fail to avoid interrupting reading flow.
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      aria-label={isSaved ? "Saved" : "Save"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border px-0 text-sm font-medium transition sm:w-auto sm:gap-2 sm:px-3 ${
        isSaved
          ? "border-blue-400/40 bg-blue-500/15 text-blue-300"
          : "border-white/10 bg-slate-900/55 text-slate-300 hover:border-white/20 hover:bg-slate-800 hover:text-white"
      } ${loading ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {isSaved ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
      <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default SaveButton;
