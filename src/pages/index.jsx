import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaRegBookmark,
  FaShareAlt,
} from "react-icons/fa";
import {
  IoSadOutline,
  IoHappyOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import CheckAuthModal from "../../components/CheckAuth";
import SharePopup from "../../components/SharePopUp";
import SaveButton from "../../components/SaveButton";
import CommentButton from "../../components/CommentButton";
import LikeButton from "../../components/LikeButton";
import CategoriesBar from "../../components/CategoriesBar";
import AddRegretButton from "../../components/AddRegretButton";

const API_BASE_URL = "https://stagingcrm.goldensupplementstore.com/api";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail");

  const getApiConfig = useCallback(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
      params: { email: storedEmail },
    }),
    [token, storedEmail]
  );

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categories`, getApiConfig())
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error("Error fetching categories", err));
  }, [getApiConfig]);

  useEffect(() => {
    const apiUrl =
      selectedCategory === "All"
        ? `${API_BASE_URL}/questions`
        : `${API_BASE_URL}/questions/category/${selectedCategory}`;

    setLoading(true);
    axios
      .get(apiUrl, getApiConfig())
      .then((res) => {
        const fetchedQuestions = res.data.questions || [];
        setQuestions(fetchedQuestions);
        setLikes(
          fetchedQuestions.reduce(
            (acc, q) => ({
              ...acc,
              [q.id]: {
                liked: q.liked_by_user || false,
                count: q.likes_count || 0,
              },
            }),
            {}
          )
        );
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, getApiConfig]);

  const handleCategoryClick = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setQuestions([]);
  }, []);

  const handleLike = useCallback(
    async (e, questionId) => {
      e.preventDefault();
      e.stopPropagation();
      setLikes((prev) => ({
        ...prev,
        [questionId]: {
          liked: !prev[questionId]?.liked,
          count: prev[questionId]?.liked
            ? prev[questionId].count - 1
            : prev[questionId].count + 1,
        },
      }));

      try {
        await axios.post(
          `${API_BASE_URL}/questions/${questionId}/like`,
          {},
          getApiConfig()
        );
      } catch (err) {
        console.error("Like error:", err);
      }
    },
    [getApiConfig]
  );

  const handleAddRegret = () => setIsModalOpen(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory((prev) => prev); // trigger refresh
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex flex-col items-center py-6 px-4 sm:px-8">
      {/* Fixed Floating Button + Header */}
      <AddRegretButton onClick={handleAddRegret} />
      <AddRegretButton onClick={handleAddRegret} variant="fixed" />

      {/* Category Filter */}
      <div className="w-full max-w-4xl mb-6">
        <CategoriesBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      <CheckAuthModal isOpen={isModalOpen} onClose={handleModalClose} />

      {loading ? (
        <p className="text-lg font-semibold py-8">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          No regrets found in this category.
        </p>
      ) : (
        <div className="w-full max-w-3xl space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => navigate(`/regrets/${q.id}`)}
              className="bg-[#101010] hover:bg-[#181818] border border-gray-800 rounded-2xl p-6 transition-all cursor-pointer shadow-md hover:shadow-xl group"
            >
              {/* Author Section */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 text-white font-bold text-lg">
                  {q.is_anonymous ? "🕶️" : q.user?.name?.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-lg text-white">
                    {q.is_anonymous ? "Anonymous" : q.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(q.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Question */}
              <p className="text-white text-[1.1rem] sm:text-lg font-medium leading-relaxed mb-4">
                {q.title}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-start space-x-4 text-gray-400 text-sm mt-4">
                <LikeButton
                  questionId={q.id}
                  likes={likes}
                  handleLike={handleLike}
                />
                <CommentButton questionId={q.id} onNavigate={navigate} />
                <SharePopup regretId={q.id} regretTitle={q.title} />
                <SaveButton questionId={q.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
