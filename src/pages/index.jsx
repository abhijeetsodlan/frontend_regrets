import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserSecret, FaSyncAlt, FaCrown } from "react-icons/fa";
import CheckAuthModal from "../../components/CheckAuth";
import SharePopup from "../../components/SharePopUp";
import SaveButton from "../../components/SaveButton";
import CommentButton from "../../components/CommentButton";
import LikeButton from "../../components/LikeButton";
import CategoriesBar from "../../components/CategoriesBar";
import AddRegretButton from "../../components/AddRegretButton";
import SeoMeta from "../../components/SeoMeta";
import { getCategories, getQuestions, likeQuestion } from "../services/questionService";
import { buildWsUrl } from "../services/config";
import { Link } from "react-router-dom";
import { getNightRoomStatus } from "../services/nightRoomService";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [topRegretOfDay, setTopRegretOfDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isNightRoomOpen, setIsNightRoomOpen] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const wsRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const pullStartYRef = useRef(null);
  const isPullingRef = useRef(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail");

  useEffect(() => {
    getCategories({ token: token || "", email: storedEmail || "" })
      .then((data) => setCategories(data.data || []))
      .catch(() => setCategories([]));
  }, [token, storedEmail]);

  useEffect(() => {
    const refreshNightRoomStatus = async () => {
      try {
        const data = await getNightRoomStatus();
        setIsNightRoomOpen(Boolean(data.is_open));
      } catch {
        setIsNightRoomOpen(false);
      }
    };

    refreshNightRoomStatus();
    const intervalRef = setInterval(refreshNightRoomStatus, 60000);
    return () => clearInterval(intervalRef);
  }, []);

  const loadQuestions = useCallback(async ({ showPageLoader = true } = {}) => {
    if (showPageLoader) {
      setLoading(true);
    }
    try {
      const data = await getQuestions({
        category: selectedCategory,
        token: token || "",
        email: storedEmail || ""
      });
      const fetchedQuestions = data.questions || [];
      setQuestions(fetchedQuestions);
      if (selectedCategory === "All") {
        setTopRegretOfDay(data.top_regret_of_day || null);
      } else {
        setTopRegretOfDay(null);
      }
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
  }, [selectedCategory, token, storedEmail]);

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
        await likeQuestion(questionId, { token: token || "", email: storedEmail || "" });
      } catch {
        // Keep optimistic UI for a smoother feel.
      }
    },
    [token, storedEmail]
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
    setIsModalOpen(false);
    upsertQuestionInFeed(question);
    showSuccessToast("Regret posted");
    loadQuestions({ showPageLoader: false });
  }, [loadQuestions, showSuccessToast, upsertQuestionInFeed]);

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
      setPullDistance(0);
      if (navigator.vibrate) {
        navigator.vibrate(18);
      }
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
      const wsUrl = buildWsUrl("/ws", { token });
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

  const topQuestion = topRegretOfDay?.question || null;
  const visibleQuestions = topQuestion
    ? questions.filter((question) => question.id !== topQuestion.id)
    : questions;

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
          <FaSyncAlt className="animate-spin" size={18} />
        </div>
      )}

      <div
        className="mx-auto w-full max-w-4xl px-4 pb-10 pt-8 transition-transform duration-200 ease-out sm:px-6"
        style={{ transform: `translateY(${isRefreshing ? 0 : pullDistance}px)` }}
      >
        <div className="mb-4 hidden justify-end sm:flex">
          <AddRegretButton onClick={handleAddRegret} />
        </div>

        {isNightRoomOpen && (
          <Link
            to="/9-4-room"
            className="mb-4 block rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100 transition hover:bg-cyan-500/20"
          >
            🌙 The 9–4 Room is open.
          </Link>
        )}

        <CategoriesBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-8 text-center text-lg font-medium text-slate-300">
            Loading regrets...
          </div>
        ) : visibleQuestions.length === 0 && !topQuestion ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-8 text-center text-slate-400">
            No regrets found in this story type.
          </div>
        ) : (
          <div className="space-y-5">
            {topQuestion && (
              <article
                key={`top-${topQuestion.id}`}
                onClick={() => navigate(`/regrets/${topQuestion.id}`)}
                className="group cursor-pointer rounded-2xl border border-amber-300/35 bg-gradient-to-r from-amber-500/15 via-orange-400/10 to-rose-500/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/50 sm:p-6"
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200/40 bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                  <FaCrown size={11} />
                  Currently Echoing the Loudest
                </div>
                {topQuestion.is_anonymous ? (
                  <div className="mb-4 flex items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 text-slate-200">
                      <FaUserSecret size={18} />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-semibold leading-none">Anonymous</p>
                    </div>
                  </div>
                ) : (
                  topQuestion.user && (
                    <div className="mb-4 flex items-center">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-rose-500 text-base font-bold text-white">
                        {topQuestion.user.avatar ? (
                          <span className="text-lg leading-none">{topQuestion.user.avatar}</span>
                        ) : (
                          topQuestion.user.name.charAt(0)
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-lg font-semibold leading-none">{topQuestion.user.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-amber-100/80">
                          {formatCreatedDate(topQuestion.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                )}
                <p className="mb-5 text-left text-xl leading-relaxed text-slate-100 sm:text-2xl">
                  {topQuestion.title}
                </p>
                <div className="flex w-full items-center gap-2 border-t border-amber-100/20 pt-4 sm:gap-3">
                  <LikeButton questionId={topQuestion.id} likes={likes} handleLike={handleLike} />
                  <CommentButton
                    questionId={topQuestion.id}
                    onNavigate={navigate}
                    repliesCount={topQuestion.replies_count || 0}
                  />
                  <SharePopup regretId={topQuestion.id} regretTitle={topQuestion.title} />
                  <SaveButton
                    questionId={topQuestion.id}
                    initiallySaved={topQuestion.is_saved || false}
                    onRequireAuth={() => setIsModalOpen(true)}
                  />
                </div>
              </article>
            )}
            {visibleQuestions.map((question) => (
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
