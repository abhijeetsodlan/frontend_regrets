import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserSecret, FaSyncAlt } from "react-icons/fa";
import CheckAuthModal from "../../components/CheckAuth";
import SharePopup from "../../components/SharePopUp";
import SaveButton from "../../components/SaveButton";
import CommentButton from "../../components/CommentButton";
import LikeButton from "../../components/LikeButton";
import CategoriesBar from "../../components/CategoriesBar";
import AddRegretButton from "../../components/AddRegretButton";
import SeoMeta from "../../components/SeoMeta";

const API_BASE_URL = "http://localhost:3000/api";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const wsRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const pullStartYRef = useRef(null);
  const isPullingRef = useRef(false);

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

  const loadQuestions = useCallback(async ({ showPageLoader = true } = {}) => {
    const apiUrl =
      selectedCategory === "All"
        ? `${API_BASE_URL}/questions`
        : `${API_BASE_URL}/questions/category/${selectedCategory}`;

    if (showPageLoader) {
      setLoading(true);
    }
    try {
      const response = await axios.get(apiUrl, getApiConfig());
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
    } catch {
      setQuestions([]);
    } finally {
      if (showPageLoader) {
        setLoading(false);
      }
    }
  }, [selectedCategory, getApiConfig]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

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

  const showSuccessToast = useCallback((message) => {
    setToastMessage(message);
    setShowToast(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2200);
  }, []);

  const upsertQuestionInFeed = useCallback((question) => {
    if (!question?.id) {
      return;
    }
    if (selectedCategory !== "All" && question.category_id !== selectedCategory) {
      return;
    }

    setQuestions((prev) => {
      const withoutCurrent = prev.filter((row) => row.id !== question.id);
      return [question, ...withoutCurrent];
    });

    setLikes((prev) => ({
      ...prev,
      [question.id]: {
        liked: question.liked_by_user || false,
        count: question.likes_count || 0
      }
    }));
  }, [selectedCategory]);

  const handleQuestionCreated = useCallback((question) => {
    upsertQuestionInFeed(question);
    showSuccessToast("Posted a new regret");
  }, [showSuccessToast, upsertQuestionInFeed]);

  const handleTouchStart = useCallback((event) => {
    if (window.innerWidth >= 640 || isRefreshing) {
      return;
    }
    if (window.scrollY > 0) {
      return;
    }
    pullStartYRef.current = event.touches[0].clientY;
    isPullingRef.current = true;
  }, [isRefreshing]);

  const handleTouchMove = useCallback((event) => {
    if (!isPullingRef.current || pullStartYRef.current === null || isRefreshing) {
      return;
    }
    const delta = event.touches[0].clientY - pullStartYRef.current;
    if (delta <= 0) {
      setPullDistance(0);
      return;
    }
    if (window.scrollY > 0) {
      isPullingRef.current = false;
      setPullDistance(0);
      return;
    }

    const nextDistance = Math.min(110, delta * 0.45);
    setPullDistance(nextDistance);
    event.preventDefault();
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) {
      return;
    }
    isPullingRef.current = false;
    pullStartYRef.current = null;

    if (pullDistance >= 70 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(52);
      await loadQuestions({ showPageLoader: false });
      setIsRefreshing(false);
    }
    setPullDistance(0);
  }, [isRefreshing, loadQuestions, pullDistance]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let cancelled = false;
    const connect = () => {
      if (cancelled) {
        return;
      }
      const apiUrl = new URL(API_BASE_URL);
      const wsProtocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${apiUrl.host}/ws?token=${encodeURIComponent(token)}`;
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data || "{}");
          if (payload.type === "question:new" && payload.question) {
            upsertQuestionInFeed(payload.question);
          }
        } catch {
          // Ignore malformed socket payloads.
        }
      };

      socket.onclose = () => {
        if (!cancelled) {
          setTimeout(connect, 2500);
        }
      };

      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      cancelled = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [token, upsertQuestionInFeed]);

  const formatCreatedDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SeoMeta
        title="Explore Regrets"
        description="Browse anonymous regrets across categories, react, comment, and share meaningful stories on Regrets.in."
        path="/regrets"
        keywords="explore regrets, anonymous stories, confessions feed, regrets community"
      />
      <AddRegretButton onClick={handleAddRegret} variant="fixed" />

      <CheckAuthModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onQuestionCreated={handleQuestionCreated}
      />

      {showToast && (
        <div className="fixed right-4 top-20 z-[75] rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 shadow-[0_12px_28px_rgba(16,185,129,0.25)]">
          {toastMessage}
        </div>
      )}

      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed left-1/2 top-16 z-[74] flex -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/85 p-2 text-slate-200 shadow-xl transition-all duration-150"
          style={{
            transform: `translate(-50%, ${Math.max(0, pullDistance - 50)}px) scale(${isRefreshing ? 1 : Math.min(1, 0.72 + pullDistance / 180)})`,
            opacity: isRefreshing ? 1 : Math.min(1, pullDistance / 70)
          }}
        >
          <FaSyncAlt className="animate-spin" size={14} />
        </div>
      )}

      <div
        className="mx-auto w-full max-w-4xl px-4 pb-10 pt-8 transition-transform duration-200 ease-out sm:px-6"
        style={{ transform: `translateY(${isRefreshing ? 12 : pullDistance}px)` }}
      >
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
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-rose-500 text-base font-bold text-white">
                        {question.user.avatar ? (
                          <span className="text-lg leading-none">{question.user.avatar}</span>
                        ) : (
                          question.user.name.charAt(0)
                        )}
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
                  <CommentButton
                    questionId={question.id}
                    onNavigate={navigate}
                    repliesCount={question.replies_count || 0}
                  />
                  <SharePopup regretId={question.id} regretTitle={question.title} />
                  <SaveButton
                    questionId={question.id}
                    initiallySaved={question.is_saved || false}
                    onRequireAuth={() => setIsModalOpen(true)}
                  />
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
