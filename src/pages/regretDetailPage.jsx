import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeartBroken, FaArrowLeft, FaPaperPlane, FaSyncAlt, FaUserSecret } from "react-icons/fa";
import SharePopup from "../../components/SharePopUp";
import SeoMeta from "../../components/SeoMeta";
import { createComment, getCommentsByQuestion } from "../services/commentService";
import { getQuestionDetails, likeQuestion } from "../services/questionService";

const RegretDetailPage = () => {
  const { regret_id } = useParams();
  const [regret, setRegret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isAnonymousReply, setIsAnonymousReply] = useState(true);
  const [comments, setComments] = useState([]);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [likeIconScale, setLikeIconScale] = useState(1);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const likeAnimTimeoutRef = useRef(null);
  const pullStartYRef = useRef(null);
  const isPullingRef = useRef(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail");

  const sortCommentsNewestFirst = (items = []) =>
    [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const loadData = useCallback(async ({ showPageLoader = true } = {}) => {
    if (showPageLoader) {
      setLoading(true);
    }
    try {
      const [questionRes, commentsRes] = await Promise.all([
        getQuestionDetails(regret_id, { token: token || "", email: storedEmail || "" }),
        getCommentsByQuestion(regret_id, { token: token || "", email: storedEmail || "" })
      ]);

      setRegret(questionRes.question || null);
      setComments(sortCommentsNewestFirst(commentsRes.comments || []));
      setError(null);
    } catch {
      if (showPageLoader) {
        setError("Failed to load regret details.");
      }
    } finally {
      if (showPageLoader) {
        setLoading(false);
      }
    }
  }, [regret_id, storedEmail, token]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [loadData, regret_id]);

  useEffect(() => {
    return () => {
      if (likeAnimTimeoutRef.current) {
        clearTimeout(likeAnimTimeoutRef.current);
      }
    };
  }, []);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!regret) return;

    const newLikedStatus = !regret.liked_by_user;
    if (newLikedStatus) {
      if (likeAnimTimeoutRef.current) {
        clearTimeout(likeAnimTimeoutRef.current);
      }
      setLikeIconScale(1.3);
      likeAnimTimeoutRef.current = setTimeout(() => {
        setLikeIconScale(1);
        likeAnimTimeoutRef.current = null;
      }, 220);
    }
    setRegret((prev) => ({
      ...prev,
      liked_by_user: newLikedStatus,
      likes_count: newLikedStatus ? prev.likes_count + 1 : prev.likes_count - 1
    }));

    try {
      await likeQuestion(regret_id, { token: token || "", email: storedEmail || "" });
    } catch {
      setRegret((prev) => ({
        ...prev,
        liked_by_user: !newLikedStatus,
        likes_count: !newLikedStatus ? prev.likes_count + 1 : prev.likes_count - 1
      }));
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      await createComment({
        title: replyText.trim(),
        questionId: regret_id,
        isAnonymous: isAnonymousReply,
        token: token || "",
        email: storedEmail || ""
      });

      setReplyText("");
      const data = await getCommentsByQuestion(regret_id, { token: token || "", email: storedEmail || "" });
      setComments(sortCommentsNewestFirst(data.comments || []));
    } catch {
      // keep quiet to avoid interrupting flow
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleTouchStart = useCallback((event) => {
    if (window.innerWidth >= 640 || isRefreshing || loading) {
      return;
    }
    if (window.scrollY > 0) {
      return;
    }
    pullStartYRef.current = event.touches[0].clientY;
    isPullingRef.current = true;
  }, [isRefreshing, loading]);

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
      await loadData({ showPageLoader: false });
      setIsRefreshing(false);
    }

    setPullDistance(0);
  }, [isRefreshing, loadData, pullDistance]);

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  const regretSnippet = regret?.title || "";
  const regretTitle =
    regretSnippet.length > 60 ? `${regretSnippet.slice(0, 60)}...` : regretSnippet;
  const regretDescription =
    regretSnippet.length > 145 ? `${regretSnippet.slice(0, 145)}...` : regretSnippet;
  const seoMeta = (
    <SeoMeta
      title={regretTitle || "Regret Details"}
      description={regretDescription || "Read regret details, reactions, and replies on Regrets.in."}
      path={`/regrets/${regret_id}`}
      type="article"
    />
  );

  if (loading) {
    return (
      <>
        {seoMeta}
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-10 text-white">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-center text-slate-300">
            Loading regret...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {seoMeta}
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-10 text-white">
          <div className="mx-auto max-w-3xl rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 text-center text-rose-200">
            {error}
          </div>
        </div>
      </>
    );
  }

  if (!regret) {
    return (
      <>
        {seoMeta}
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-10 text-white">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-center text-slate-400">
            Regret not found.
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white sm:py-10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {seoMeta}
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
        className="mx-auto w-full max-w-3xl transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${isRefreshing ? 0 : pullDistance}px)` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-slate-800 hover:text-white"
        >
          <FaArrowLeft size={12} />
          Back
        </button>

        <article className="rounded-2xl border border-white/10 bg-slate-900/65 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
          <div className="mb-5 flex items-center">
            {regret.is_anonymous ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-slate-200">
                <FaUserSecret size={18} />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-rose-500 text-base font-bold text-white">
                {regret.user?.avatar ? (
                  <span className="text-xl leading-none">{regret.user.avatar}</span>
                ) : (
                  regret.user?.name?.charAt(0) || "U"
                )}
              </div>
            )}

            <div className="ml-3">
              <p className="text-lg font-semibold text-slate-100">
                {regret.is_anonymous ? "Anonymous" : regret.user?.name || "Unknown"}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {formatDate(regret.created_at)}
              </p>
            </div>
          </div>

          <p className="mb-6 text-xl leading-relaxed text-slate-100 sm:text-2xl">{regret.title}</p>

          <div className="mb-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 sm:gap-3">
            <button
              onClick={handleLike}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium transition ${
                regret.liked_by_user
                  ? "border-rose-300/40 bg-rose-500/15 text-rose-200"
                  : "border-white/10 bg-slate-900/55 text-slate-300 hover:border-white/20 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FaHeartBroken
                size={14}
                className={regret.liked_by_user ? "text-rose-300" : ""}
                style={{ transform: `scale(${likeIconScale})`, transition: "transform 220ms ease" }}
              />
              <span>{regret.likes_count || 0}</span>
            </button>

            <SharePopup regretId={regret.id} regretTitle={regret.title} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <form onSubmit={handleReplySubmit} className="space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a thoughtful reply..."
                rows={3}
                maxLength={280}
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-rose-300/50 focus:ring-2 focus:ring-rose-400/25"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAnonymousReply}
                    onChange={() => setIsAnonymousReply(!isAnonymousReply)}
                    className="h-4 w-4 accent-rose-500"
                  />
                  Post anonymously
                </label>

                <button
                  type="submit"
                  disabled={submittingReply || !replyText.trim()}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(251,113,133,0.3)] transition hover:from-rose-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaPaperPlane size={12} />
                  {submittingReply ? "Posting..." : "Post Reply"}
                </button>
              </div>
            </form>
          </div>
        </article>

        <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_14px_35px_rgba(0,0,0,0.28)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Replies</h3>
            <span className="rounded-full border border-white/10 bg-slate-900/65 px-3 py-1 text-xs text-slate-300">
              {comments.length}
            </span>
          </div>

          {comments.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-400">
              No replies yet. Be the first to respond.
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-xl border border-white/10 bg-slate-950/55 p-4"
                >
                  <div className="mb-2 flex items-center">
                    {comment.is_anonymous ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-200">
                        <FaUserSecret size={12} />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-rose-500 text-xs font-bold text-white">
                        {comment.user?.avatar ? (
                          <span className="text-sm leading-none">{comment.user.avatar}</span>
                        ) : (
                          comment.user?.name?.charAt(0) || "U"
                        )}
                      </div>
                    )}
                    <div className="ml-2">
                      <p className="text-sm font-medium text-slate-100">
                        {comment.is_anonymous ? "Anonymous" : comment.user?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{comment.title}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RegretDetailPage;
