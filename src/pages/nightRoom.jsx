import React, { useCallback, useEffect, useState } from "react";
import { FaHeartBroken, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SeoMeta from "../../components/SeoMeta";
import {
  createNightRoomPost,
  enterNightRoom,
  heartbeatNightRoom,
  leaveNightRoom,
  listNightRoomPosts,
  toggleNightRoomLike
} from "../services/nightRoomService";

const MICRO_LINES = [
  "Late thoughts hit differently.",
  "Some regrets only speak at night.",
  "Nothing here stays forever.",
  "Say it before morning comes."
];

const PRESENCE_INTERVAL_MS = 25000;
const POSTS_REFRESH_MS = 15000;

const formatClock = (value) =>
  new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const NightRoomPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token") || "";
  const [sessionId] = useState(() => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`));
  const [isOpen, setIsOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composerText, setComposerText] = useState("");
  const [isAnonymousPost, setIsAnonymousPost] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [pageReady, setPageReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const refreshPosts = useCallback(async () => {
    const data = await listNightRoomPosts({ token, sessionId });
    setIsOpen(Boolean(data.is_open));
    setActiveUsers(Number(data.active_users || 0));
    setPosts(data.posts || []);
  }, [sessionId, token]);

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      try {
        await enterNightRoom({ token, sessionId });
        await refreshPosts();
      } catch {
        if (mounted) {
          setStatusMessage("Could not load The 9-4 Room right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setPageReady(true);
        }
      }
    };
    boot();

    const presenceInterval = setInterval(async () => {
      try {
        const data = await heartbeatNightRoom({ token, sessionId });
        setActiveUsers(Number(data.active_users || 0));
      } catch {
        // Keep UI calm if heartbeat misses.
      }
    }, PRESENCE_INTERVAL_MS);

    const postsInterval = setInterval(() => {
      refreshPosts().catch(() => {});
    }, POSTS_REFRESH_MS);

    return () => {
      mounted = false;
      clearInterval(presenceInterval);
      clearInterval(postsInterval);
      leaveNightRoom({ token, sessionId }).catch(() => {});
    };
  }, [refreshPosts, sessionId, token]);

  useEffect(() => {
    const lineInterval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % MICRO_LINES.length);
    }, 5500);
    return () => clearInterval(lineInterval);
  }, []);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (!token) {
      setStatusMessage("Login is required to post in The 9-4 Room.");
      return;
    }
    if (!isOpen || !composerText.trim()) {
      return;
    }

    try {
      await createNightRoomPost({
        title: composerText.trim(),
        isAnonymous: isAnonymousPost,
        token
      });
      setComposerText("");
      await refreshPosts();
    } catch (err) {
      setStatusMessage(err?.response?.data?.message || "Could not post right now.");
    }
  };

  const handleLike = async (postId) => {
    if (!token || !isOpen) {
      return;
    }
    setPosts((prev) =>
      prev.map((row) =>
        row.id === postId
          ? {
              ...row,
              liked_by_user: !row.liked_by_user,
              likes_count: row.liked_by_user ? row.likes_count - 1 : row.likes_count + 1
            }
          : row
      )
    );

    try {
      await toggleNightRoomLike(postId, { token });
    } catch {
      await refreshPosts();
    }
  };

  return (
    <div className={`night-room-bg min-h-screen px-4 py-8 text-slate-100 transition-opacity duration-700 ${pageReady ? "opacity-100" : "opacity-0"}`}>
      <SeoMeta
        title="The 9-4 Room"
        description="A slower night space for vulnerable thoughts."
        path="/9-4-room"
      />

      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide text-slate-100">
              <FaMoon className="mr-2 inline-block text-slate-300" size={16} />
              The 9-4 Room
            </h1>
            <p className="mt-1 text-sm text-slate-400">{MICRO_LINES[lineIndex]}</p>
          </div>
          <div className="rounded-full border border-cyan-200/20 bg-slate-900/45 px-3 py-1 text-xs text-cyan-100 shadow-[0_0_18px_rgba(125,211,252,0.2)]">
            ● {activeUsers} here now
          </div>
        </div>

        {!isOpen && !loading && (
          <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-4 text-sm text-slate-300">
            The room is closed. It opens nightly at 9:00 P.M.
          </div>
        )}

        {statusMessage && (
          <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {statusMessage}
          </div>
        )}

        {isOpen && (
          <form onSubmit={handleCreatePost} className="mb-5 rounded-2xl border border-white/10 bg-slate-900/45 p-4 backdrop-blur">
            <textarea
              value={composerText}
              onChange={(event) => setComposerText(event.target.value)}
              placeholder="Write what you can only say at night..."
              rows={3}
              maxLength={280}
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/35"
            />
            <div className="mt-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={isAnonymousPost}
                  onChange={() => setIsAnonymousPost((prev) => !prev)}
                  className="h-4 w-4 accent-cyan-400"
                />
                Post anonymously
              </label>
              <button
                type="submit"
                disabled={!composerText.trim()}
                className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Share quietly
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-6 text-sm text-slate-300">
            Loading night entries...
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {post.is_anonymous ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-200">A</div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-cyan-500 text-xs font-bold text-white">
                        {post.user?.avatar ? <span>{post.user.avatar}</span> : (post.user?.name?.charAt(0) || "U")}
                      </div>
                    )}
                    <p className="text-sm text-slate-200">
                      {post.is_anonymous ? "Anonymous" : post.user?.name || "Unknown"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">{formatClock(post.created_at)}</p>
                </div>
                <p className="text-sm leading-7 text-slate-100">{post.title}</p>
                <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                      post.liked_by_user
                        ? "border-rose-300/35 bg-rose-500/15 text-rose-100"
                        : "border-white/10 bg-slate-900/50 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <FaHeartBroken size={12} />
                    {post.likes_count || 0}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/9-4-room/${post.id}`)}
                    className="rounded-full border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/20"
                  >
                    Reply ({post.replies_count || 0})
                  </button>
                </div>
              </article>
            ))}
            {!loading && posts.length === 0 && isOpen && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-6 text-sm text-slate-400">
                Quiet night. Be the first to speak.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NightRoomPage;
