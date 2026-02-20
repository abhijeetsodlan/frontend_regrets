import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserSecret } from "react-icons/fa";
import CheckAuthModal from "../../components/CheckAuth";
import SharePopup from "../../components/SharePopUp";
import SaveButton from "../../components/SaveButton";
import CommentButton from "../../components/CommentButton";
import LikeButton from "../../components/LikeButton";
import CategoriesBar from "../../components/CategoriesBar";
import AddRegretButton from "../../components/AddRegretButton";

const API_BASE_URL = "http://localhost:3000/api";

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
      params: { email: storedEmail }
    }),
    [token, storedEmail]
  );

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categories`, getApiConfig())
      .then((response) => setCategories(response.data.data || []))
      .catch(() => setCategories([]));
  }, [getApiConfig]);

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
                count: q.likes_count || 0
              }
            }),
            {}
          )
        );
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, getApiConfig]);

  const handleCategoryClick = useCallback((categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? prev : categoryId));
  }, []);

  const handleLike = useCallback(
    async (e, questionId) => {
      e.preventDefault();
      e.stopPropagation();

      if (!token) {
        setIsModalOpen(true);
        return;
      }

      setLikes((prev) => ({
        ...prev,
        [questionId]: {
          liked: !prev[questionId]?.liked,
          count: prev[questionId]?.liked
            ? prev[questionId].count - 1
            : prev[questionId].count + 1
        }
      }));

      try {
        await axios.post(`${API_BASE_URL}/questions/${questionId}/like`, {}, getApiConfig());
      } catch (_err) {
        // Keep optimistic UI for a smoother feel.
      }
    },
    [getApiConfig, token]
  );

  const handleAddRegret = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory((prev) => prev);
  };

  const formatCreatedDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 text-white">
      <AddRegretButton onClick={handleAddRegret} variant="fixed" />

      <CheckAuthModal isOpen={isModalOpen} onClose={handleModalClose} />

      <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-8 sm:px-6">
        <div className="mb-4 hidden justify-end sm:flex">
          <AddRegretButton onClick={handleAddRegret} />
        </div>

        <CategoriesBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-8 text-center text-lg font-medium text-slate-300">
            Loading regrets...
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-8 text-center text-slate-400">
            No regrets found in this story type.
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((question) => (
              <article
                key={question.id}
                onClick={() => navigate(`/regrets/${question.id}`)}
                className="group cursor-pointer rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/35 hover:bg-slate-900/85 sm:p-6"
              >
                {question.is_anonymous ? (
                  <div className="mb-4 flex items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 text-slate-200">
                      <FaUserSecret size={18} />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-semibold leading-none">Anonymous</p>
                    </div>
                  </div>
                ) : (
                  question.user && (
                    <div className="mb-4 flex items-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-base font-bold text-white">
                        {question.user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-semibold leading-none">{question.user.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                          {formatCreatedDate(question.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                )}

                <p className="mb-5 text-left text-xl leading-relaxed text-slate-100 sm:text-2xl">
                  {question.title}
                </p>

                <div className="flex w-full items-center gap-2 border-t border-white/10 pt-4 sm:gap-3">
                  <LikeButton questionId={question.id} likes={likes} handleLike={handleLike} />
                  <CommentButton questionId={question.id} onNavigate={navigate} />
                  <SharePopup regretId={question.id} regretTitle={question.title} />
                  <SaveButton questionId={question.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
