import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegHeart, FaHeart, FaArrowLeft, FaPaperPlane, FaUserSecret } from "react-icons/fa";
import SharePopup from "../../components/SharePopUp";
import SeoMeta from "../../components/SeoMeta";

const API_BASE_URL = "http://localhost:3000/api";

const RegretDetailPage = () => {
  const { regret_id } = useParams();
  const [regret, setRegret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isAnonymousReply, setIsAnonymousReply] = useState(true);
  const [comments, setComments] = useState([]);
  const [submittingReply, setSubmittingReply] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail");

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  const getAuthHeaderWithEmail = () => ({
    headers: { Authorization: `Bearer ${token}` },
    params: { email: storedEmail }
  });

  const sortCommentsNewestFirst = (items = []) =>
    [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const loadData = async () => {
    try {
      const [questionRes, commentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/questions/${regret_id}`, getAuthHeaderWithEmail()),
        axios.get(`${API_BASE_URL}/comments/${regret_id}`, getAuthHeaderWithEmail())
      ]);

      setRegret(questionRes.data.question || null);
      setComments(sortCommentsNewestFirst(commentsRes.data.comments || []));
      setError(null);
    } catch (_err) {
      setError("Failed to load regret details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regret_id]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!regret) return;

    const newLikedStatus = !regret.liked_by_user;
    setRegret((prev) => ({
      ...prev,
      liked_by_user: newLikedStatus,
      likes_count: newLikedStatus ? prev.likes_count + 1 : prev.likes_count - 1
    }));

    try {
      await axios.post(`${API_BASE_URL}/questions/${regret_id}/like`, {}, getAuthHeader());
    } catch (_error) {
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
      await axios.post(
        `${API_BASE_URL}/comment`,
        {
          title: replyText.trim(),
          question_id: regret_id,
          is_anonymous: isAnonymousReply ? 1 : 0,
          email: storedEmail
        },
        getAuthHeader()
      );

      setReplyText("");
      const res = await axios.get(`${API_BASE_URL}/comments/${regret_id}`, getAuthHeaderWithEmail());
      setComments(sortCommentsNewestFirst(res.data.comments || []));
    } catch (_error) {
      // keep quiet to avoid interrupting flow
    } finally {
      setSubmittingReply(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white sm:py-10">
      {seoMeta}
      <div className="mx-auto w-full max-w-3xl">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-base font-bold text-white">
                {regret.user?.name?.charAt(0) || "U"}
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
              {regret.liked_by_user ? <FaHeart size={14} className="text-rose-300" /> : <FaRegHeart size={14} />}
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                        {comment.user?.name?.charAt(0) || "U"}
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
