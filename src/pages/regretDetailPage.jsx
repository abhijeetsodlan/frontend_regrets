import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaRegHeart,
  FaHeart,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import SharePopup from "../../components/SharePopUp";

const API_BASE_URL = "https://stagingcrm.goldensupplementstore.com/api";

const RegretDetailPage = () => {
  const { regret_id } = useParams();
  const [regret, setRegret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isAnonymousReply, setIsAnonymousReply] = useState(true);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail");

  const getApiConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
    params: { email: storedEmail },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRegret = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/questions/${regret_id}`,
          getApiConfig()
        );
        setRegret(response.data.question);
        setLoading(false);
      } catch (err) {
        setError("Failed to load regret details.");
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/comments/${regret_id}`,
          getApiConfig()
        );
        setComments(response.data.comments); // Assumes API returns { comments: [...] }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchRegret();
    fetchComments();
  }, [regret_id]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!regret) return;

    const newLikedStatus = !regret.liked_by_user;
    setRegret({
      ...regret,
      liked_by_user: newLikedStatus,
      likes_count: newLikedStatus
        ? regret.likes_count + 1
        : regret.likes_count - 1,
    });

    try {
      await axios.post(
        `${API_BASE_URL}/questions/${regret_id}/like`,
        {},
        getApiConfig()
      );
    } catch (error) {
      console.error("Error liking question:", error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/comment`,
        {
          title: replyText,
          question_id: regret_id,
          is_anonymous: isAnonymousReply ? 1 : 0,
        },
        getApiConfig()
      );
      setReplyText("");
      // Refetch comments
      const res = await axios.get(
        `${API_BASE_URL}/comments/${regret_id}`,
        getApiConfig()
      );
      setComments(res.data.comments);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (loading) return <p className="text-center text-white py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-400 py-4">{error}</p>;
  if (!regret)
    return <p className="text-center text-gray-400 py-4">Regret not found.</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition mb-6 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center mb-5">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg mr-4 shadow-sm
                ${
                  regret.is_anonymous
                    ? "bg-gray-700 text-white"
                    : "bg-red-500 text-white"
                }`}
            >
              {regret.is_anonymous ? "🕶️" : regret.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-base sm:text-lg text-gray-100">
                {regret.is_anonymous ? "Anonymous" : regret.user.name}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(regret.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Title */}
          <p className="text-lg sm:text-xl font-normal text-gray-100 mb-6 leading-relaxed">
            {regret.title}
          </p>

          {/* Like & Share */}
          <div className="flex items-center space-x-5 mb-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-red-500 hover:text-white text-white transition shadow-sm border border-gray-700"
            >
              {regret.liked_by_user ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              {regret.likes_count}
            </button>
            <SharePopup regretId={regret.id} regretTitle={regret.title} />
          </div>

          {/* Comment Input */}
          <form onSubmit={handleReplySubmit} className="relative mb-4">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a thoughtful reply..."
              className="w-full p-3 pr-12 rounded-xl bg-gray-800 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
            >
              <FaPaperPlane size={16} />
            </button>
          </form>

          {/* Anonymous checkbox */}
          <div className="flex items-center text-sm text-gray-300 mb-6">
            <input
              type="checkbox"
              id="anonymousReply"
              checked={isAnonymousReply}
              onChange={() => setIsAnonymousReply(!isAnonymousReply)}
              className="mr-2 accent-red-500"
            />
            <label htmlFor="anonymousReply">Post Anonymously</label>
          </div>

          {/* Comments */}
          <div className="mt-6 space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 italic">No replies yet.</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-sm"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold mr-2">
                      {comment.is_anonymous
                        ? "🕶️"
                        : comment.user?.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-100">
                      {comment.is_anonymous
                        ? "Anonymous"
                        : comment.user?.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{comment.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegretDetailPage;