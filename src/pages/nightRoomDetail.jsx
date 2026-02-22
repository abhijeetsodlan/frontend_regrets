import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaHeartBroken, FaPaperPlane } from "react-icons/fa";
import SeoMeta from "../../components/SeoMeta";
import {
  createNightRoomReply,
  getNightRoomPost,
  listNightRoomReplies,
  toggleNightRoomLike
} from "../services/nightRoomService";

const formatClock = (value) =>
  new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const NightRoomDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token") || "";
  const [sessionId] = useState(() => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`));
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyDraft, setReplyDraft] = useState("");
  const [replyAnonymous, setReplyAnonymous] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const canReply = useMemo(() => Boolean(isOpen && token && post), [isOpen, token, post]);

  const loadData = async () => {
    const [postData, repliesData] = await Promise.all([
      getNightRoomPost(postId, { token, sessionId }),
      listNightRoomReplies(postId, { token })
    ]);
    setIsOpen(Boolean(postData.is_open));
    setPost(postData.post || null);
    setReplies(repliesData.replies || []);
  };

  useEffect(() => {
    let mounted = true;
    loadData()
      .catch((err) => {
        if (mounted) {
          setStatusMessage(err?.response?.data?.message || "Could not load this post.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleLike = async () => {
    if (!post || !token || !isOpen) return;
    const optimisticLiked = !post.liked_by_user;
    setPost((prev) => ({
      ...prev,
      liked_by_user: optimisticLiked,
      likes_count: optimisticLiked ? prev.likes_count + 1 : prev.likes_count - 1
    }));
    try {
      await toggleNightRoomLike(post.id, { token });
    } catch {
      await loadData();
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    if (!canReply || !replyDraft.trim()) return;
    try {
      await createNightRoomReply(post.id, {
        title: replyDraft.trim(),
        isAnonymous: replyAnonymous,
        token
      });
      setReplyDraft("");
      await loadData();
    } catch (err) {
      setStatusMessage(err?.response?.data?.message || "Could not send reply.");
    }
  };

  return (
    <div className="night-room-bg min-h-screen px-4 py-8 text-slate-100">
      <SeoMeta title="9-4 Room Post" description="Night room post and replies." path={`/9-4-room/${postId}`} />
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/9-4-room")}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/50 px-4 py-2 text-sm text-slate-200"
        >
          <FaArrowLeft size={12} />
          Back to room
        </button>

        {statusMessage && (
          <div className="mb-4 rounded-xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {statusMessage}
          </div>
        )}

        {!isOpen && !loading && (
          <div className="mb-4 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-4 text-sm text-slate-300">
            The room is currently closed.
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-6 text-sm text-slate-300">Loading...</div>
        ) : post ? (
          <>
            <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {post.is_anonymous ? (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-200">A</div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-cyan-500 text-xs font-bold text-white">
                      {post.user?.avatar ? <span>{post.user.avatar}</span> : (post.user?.name?.charAt(0) || "U")}
                    </div>
                  )}
                  <p className="text-sm text-slate-200">{post.is_anonymous ? "Anonymous" : post.user?.name || "Unknown"}</p>
                </div>
                <p className="text-xs text-slate-500">{formatClock(post.created_at)}</p>
              </div>
              <p className="text-base leading-8 text-slate-100">{post.title}</p>
              <button
                type="button"
                onClick={handleLike}
                className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  post.liked_by_user
                    ? "border-rose-300/35 bg-rose-500/15 text-rose-100"
                    : "border-white/10 bg-slate-900/50 text-slate-300"
                }`}
              >
                <FaHeartBroken size={12} />
                {post.likes_count || 0}
              </button>
            </article>

            <section className="mt-5 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-100">Replies ({replies.length})</h2>
              <div className="space-y-2">
                {replies.map((reply) => (
                  <article key={reply.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="text-xs text-slate-400">
                      {reply.is_anonymous ? "Anonymous" : reply.user?.name || "Unknown"} • {formatClock(reply.created_at)}
                    </p>
                    <p className="mt-1 text-sm text-slate-200">{reply.title}</p>
                  </article>
                ))}
              </div>

              {isOpen && (
                <form onSubmit={handleReply} className="mt-3 space-y-2">
                  <textarea
                    value={replyDraft}
                    onChange={(event) => setReplyDraft(event.target.value)}
                    rows={3}
                    maxLength={240}
                    placeholder="Reply softly..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/65 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/35"
                  />
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={replyAnonymous}
                        onChange={() => setReplyAnonymous((prev) => !prev)}
                        className="h-4 w-4 accent-cyan-400"
                      />
                      Reply anonymously
                    </label>
                    <button
                      type="submit"
                      disabled={!canReply || !replyDraft.trim()}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 disabled:opacity-50"
                    >
                      <FaPaperPlane size={10} />
                      Send reply
                    </button>
                  </div>
                </form>
              )}
            </section>
          </>
        ) : (
          <div className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-6 text-sm text-slate-300">Post not available.</div>
        )}
      </div>
    </div>
  );
};

export default NightRoomDetailPage;
