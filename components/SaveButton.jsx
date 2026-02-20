import React, { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const SaveButton = ({ questionId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail");

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: storedEmail }
      };

      const response = await axios.post(
        `${API_BASE_URL}/savepost`,
        { question_id: questionId },
        config
      );
      if (response.status === 200 || response.status === 201) {
        setIsSaved((prev) => !prev);
      }
    } catch (_error) {
      // Silent fail to avoid interrupting reading flow.
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium transition ${
        isSaved
          ? "border-blue-400/40 bg-blue-500/15 text-blue-300"
          : "border-white/10 bg-slate-900/55 text-slate-300 hover:border-white/20 hover:bg-slate-800 hover:text-white"
      } ${loading ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {isSaved ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
      <span>{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default SaveButton;

