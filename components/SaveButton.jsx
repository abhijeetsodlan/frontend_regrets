import React, { useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const SaveButton = ({ questionId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail");

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the parent div's onClick

    if (loading) return;

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: storedEmail },
      };

      const response = await axios.post(
        `${API_BASE_URL}/savepost`,
        { question_id: questionId },
        config
      );

      if (response.status === 200 || response.status === 201) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      // Optionally handle error (e.g., show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading || isSaved}
      className={`flex items-center space-x-1 text-gray-400 hover:text-white transition-colors ${
        isSaved ? "text-blue-500" : ""
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <FaRegBookmark className="text-lg" />
      <span>{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default SaveButton;