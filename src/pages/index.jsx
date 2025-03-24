import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegBookmark, FaShareAlt } from "react-icons/fa";
import {
  IoSadOutline,
  IoHappyOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import CheckAuthModal from "../../components/CheckAuth";
import SharePopup from "../../components/SharePopUp";
import SaveButton from "../../components/SaveButton";
import CommentButton from "../../components/CommentButton";
import HappenedToMeButton from "../../components/HappenedToMeButton";
import LikeButton from "../../components/LikeButton";
import CategoriesBar from "../../components/CategoriesBar";
import AddRegretButton from "../../components/AddRegretButton";

// Constants
const API_BASE_URL = "http://127.0.0.1:8000/api";

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

  // Memoized API config
  const getApiConfig = useCallback(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
      params: { email: storedEmail },
    }),
    [token, storedEmail]
  );

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categories`, getApiConfig())
      .then((response) => setCategories(response.data.data || []))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [getApiConfig]);

  // Fetch questions
  useEffect(() => {
    const apiUrl =
      selectedCategory === "All"
        ? `${API_BASE_URL}/questions`
        : `${API_BASE_URL}/questions/category/${selectedCategory}`;

    setLoading(true);
    axios
      .get(apiUrl, getApiConfig())
      .then((response) => {
        const fetchedQuestions = response.data.questions || [];
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
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, getApiConfig]);

  // Handlers
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
      } catch (error) {
        console.error("Error liking question:", error);
      }
    },
    [getApiConfig]
  );

  const handleAddRegret = () => {
    setIsModalOpen(true);
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col items-center py-6">
      <AddRegretButton onClick={handleAddRegret} />
      <AddRegretButton onClick={handleAddRegret} variant="fixed" />

      <CategoriesBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />

      <CheckAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {loading ? (
        <p className="text-center w-full py-4 text-lg font-semibold">
          Loading...
        </p>
      ) : questions.length === 0 ? (
        <p className="text-gray-400 text-center">
          No regrets found in this category.
        </p>
      ) : (
        <div className="w-full max-w-3xl px-4">
          {questions.map((question) => (
            <div
              key={question.id}
              onClick={() => navigate(`/regrets/${question.id}`)}
              className="bg-gray-950 rounded-lg shadow-lg p-6 mb-6 hover:bg-gray-900 transition cursor-pointer border border-gray-600 hover:shadow-xl"
            >
              {/* User Info */}
              {question.is_anonymous ? (
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-500 text-white flex items-center justify-center rounded-full font-bold text-lg">
                    🕶️
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-white leading-none text-lg">
                      Anonymous
                    </p>
                  </div>
                </div>
              ) : (
                question.user && (
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-400 text-white flex items-center justify-center rounded-full font-bold text-lg">
                      {question.user.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-white leading-none text-lg">
                        {question.user.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(question.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}

              <p className="text-xl font-normal text-white mb-4 text-left">
                {question.title}
              </p>

              <div className="flex-row justify-between items-center mt-4 text-gray-400">
                <HappenedToMeButton />
                <div className="flex items-center space-x-2 sm:space-x-4 w-full">
                  <LikeButton
                    questionId={question.id}
                    likes={likes}
                    handleLike={handleLike}
                  />
                  <CommentButton
                    questionId={question.id}
                    onNavigate={navigate}
                  />
                  <SharePopup
                    regretId={question.id}
                    regretTitle={question.title}
                  />
                  <SaveButton questionId={question.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
