import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FaSearch,
  FaTrashAlt,
  FaPaperPlane,
  FaUsers,
  FaRegCommentDots,
  FaBell,
  FaInbox,
  FaTags,
  FaBars,
  FaTimes,
  FaMoon
} from "react-icons/fa";
import SeoMeta from "../../components/SeoMeta";
import {
  adminCreateStoryType,
  adminDeleteQuestion,
  adminDeleteUser,
  adminGetFeedbacks,
  adminGetQuestionReplies,
  adminGetQuestions,
  adminGetStoryTypes,
  adminGetUserPosts,
  adminGetUsers,
  adminGetNightRoomPosts,
  adminGetNightRoomReplies,
  adminGetNightRoomSettings,
  adminUpdateNightRoomSettings,
  adminSendNotification
} from "../services/adminService";
const ADMIN_EMAIL = "abhijeetsodlan7@gmail.com";
const PAGE_SIZE = 10;

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const AdminPanel = () => {
  const token = localStorage.getItem("auth_token");
  const storedEmail = (localStorage.getItem("useremail") || "").toLowerCase();
  const canAccess = Boolean(token) && storedEmail === ADMIN_EMAIL;

  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({ total_users: 0, joined_today: 0 });
  const [questions, setQuestions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [storyTypes, setStoryTypes] = useState([]);
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  const [questionsPagination, setQuestionsPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  const [feedbackPagination, setFeedbackPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  const [selectedUserPosts, setSelectedUserPosts] = useState(null);
  const [selectedQuestionReplies, setSelectedQuestionReplies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("users");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [questionSearch, setQuestionSearch] = useState("");
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [questionsPage, setQuestionsPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);

  const [notifyTarget, setNotifyTarget] = useState("all");
  const [notifyUserIds, setNotifyUserIds] = useState([]);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientUsers, setRecipientUsers] = useState([]);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [sendingNotification, setSendingNotification] = useState(false);
  const [newStoryTypeName, setNewStoryTypeName] = useState("");
  const [creatingStoryType, setCreatingStoryType] = useState(false);
  const [nightRoomPosts, setNightRoomPosts] = useState([]);
  const [nightRoomPagination, setNightRoomPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  const [nightRoomSearch, setNightRoomSearch] = useState("");
  const [nightRoomPage, setNightRoomPage] = useState(1);
  const [nightRoomSetting, setNightRoomSetting] = useState({ mode: "auto", is_open: false });
  const [updatingNightRoomMode, setUpdatingNightRoomMode] = useState(false);
  const [selectedNightRoomReplies, setSelectedNightRoomReplies] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const authToken = useMemo(() => token || "", [token]);

  const fetchUsers = async () => {
    const data = await adminGetUsers({
      search: userSearch,
      email: storedEmail,
      page: usersPage,
      limit: PAGE_SIZE,
      token: authToken
    });
    setUserStats(data.stats || { total_users: 0, joined_today: 0 });
    setUsers(data.users || []);
    setUsersPagination(data.pagination || { page: usersPage, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  };

  const fetchQuestions = async () => {
    const data = await adminGetQuestions({
      search: questionSearch,
      email: storedEmail,
      page: questionsPage,
      limit: PAGE_SIZE,
      token: authToken
    });
    setQuestions(data.questions || []);
    setQuestionsPagination(data.pagination || { page: questionsPage, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  };

  const fetchFeedbacks = async () => {
    const data = await adminGetFeedbacks({
      search: feedbackSearch,
      email: storedEmail,
      page: feedbackPage,
      limit: PAGE_SIZE,
      token: authToken
    });
    setFeedbacks(data.feedbacks || []);
    setFeedbackPagination(data.pagination || { page: feedbackPage, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  };

  const fetchRecipientUsers = async () => {
    const data = await adminGetUsers({
      search: recipientSearch,
      email: storedEmail,
      page: 1,
      limit: 50,
      token: authToken
    });
    setRecipientUsers(data.users || []);
  };

  const fetchStoryTypes = async () => {
    const data = await adminGetStoryTypes({ token: authToken });
    setStoryTypes(data.data || []);
  };

  const fetchNightRoomPosts = async () => {
    const data = await adminGetNightRoomPosts({
      search: nightRoomSearch,
      page: nightRoomPage,
      limit: PAGE_SIZE,
      token: authToken
    });
    setNightRoomPosts(data.posts || []);
    setNightRoomPagination(data.pagination || { page: nightRoomPage, limit: PAGE_SIZE, total: 0, total_pages: 1 });
  };

  const fetchNightRoomSetting = async () => {
    const data = await adminGetNightRoomSettings({ token: authToken });
    setNightRoomSetting({
      mode: data.mode || "auto",
      is_open: Boolean(data.is_open)
    });
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchUsers(), fetchQuestions()]);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canAccess) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess, userSearch, questionSearch, usersPage, questionsPage]);

  useEffect(() => {
    if (!canAccess || activePage !== "feedback") return;
    fetchFeedbacks().catch((err) => setError(err.message || "Failed to load feedbacks"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess, activePage, feedbackSearch, feedbackPage]);

  useEffect(() => {
    if (!canAccess || activePage !== "notifications") return;
    fetchRecipientUsers().catch((err) => setError(err.message || "Failed to load recipients"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess, activePage, recipientSearch]);

  useEffect(() => {
    if (!canAccess || activePage !== "story-types") return;
    fetchStoryTypes().catch((err) => setError(err.message || "Failed to load story types"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess, activePage]);

  useEffect(() => {
    if (!canAccess || activePage !== "night-room") return;
    fetchNightRoomPosts().catch((err) => setError(err.message || "Failed to load 9-4 room posts"));
    fetchNightRoomSetting().catch((err) => setError(err.message || "Failed to load 9-4 room settings"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess, activePage, nightRoomSearch, nightRoomPage]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activePage]);

  useEffect(() => {
    if (!isMobileSidebarOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSidebarOpen]);

  const handleDeleteQuestion = async (id) => {
    try {
      await adminDeleteQuestion({ id, email: storedEmail, token: authToken });
      setQuestions((prev) => prev.filter((row) => row.id !== id));
      setActionMessage("Regret deleted");
    } catch (err) {
      setActionMessage(err.message || "Action failed");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await adminDeleteUser({ id, email: storedEmail, token: authToken });
      setUsers((prev) => prev.filter((row) => row.id !== id));
      setActionMessage("User deleted");
      setSelectedUserPosts(null);
    } catch (err) {
      setActionMessage(err.message || "Action failed");
    }
  };

  const openUserPosts = async (userId) => {
    try {
      const data = await adminGetUserPosts({ userId, email: storedEmail, token: authToken });
      setSelectedUserPosts(data);
    } catch (err) {
      setActionMessage(err.message || "Action failed");
    }
  };

  const openRegretReplies = async (questionId) => {
    try {
      const data = await adminGetQuestionReplies({ questionId, email: storedEmail, token: authToken });
      setSelectedQuestionReplies(data);
    } catch (err) {
      setActionMessage(err.message || "Action failed");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifyMessage.trim() || sendingNotification) return;

    setSendingNotification(true);
    setActionMessage("");
    try {
      const data = await adminSendNotification({
        message: notifyMessage.trim(),
        sendToAll: notifyTarget === "all",
        userIds: notifyTarget === "selected" ? notifyUserIds : [],
        email: storedEmail,
        token: authToken
      });
      setActionMessage(`Notification sent (${data.sent_count || 0})`);
      setNotifyMessage("");
      setNotifyUserIds([]);
    } catch (err) {
      setActionMessage(err.message || "Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  const handleCreateStoryType = async (e) => {
    e.preventDefault();
    if (!newStoryTypeName.trim() || creatingStoryType) return;

    setCreatingStoryType(true);
    setActionMessage("");
    try {
      const data = await adminCreateStoryType({
        name: newStoryTypeName.trim(),
        email: storedEmail,
        token: authToken
      });
      setStoryTypes((prev) => {
        const next = [...prev, data.category].filter(Boolean);
        return next.sort((a, b) => String(a.name).localeCompare(String(b.name)));
      });
      setNewStoryTypeName("");
      setActionMessage("Story type added");
    } catch (err) {
      setActionMessage(err.message || "Failed to create story type");
    } finally {
      setCreatingStoryType(false);
    }
  };

  const handleNightRoomModeChange = async (mode) => {
    if (updatingNightRoomMode) return;
    setUpdatingNightRoomMode(true);
    setActionMessage("");
    try {
      const data = await adminUpdateNightRoomSettings({ mode, token: authToken });
      setNightRoomSetting({
        mode: data.mode || mode,
        is_open: Boolean(data.is_open)
      });
      setActionMessage(`9-4 Room mode updated to ${mode}`);
    } catch (err) {
      setActionMessage(err.message || "Failed to update 9-4 Room mode");
    } finally {
      setUpdatingNightRoomMode(false);
    }
  };

  const openNightRoomReplies = async (postId) => {
    try {
      const data = await adminGetNightRoomReplies({ postId, token: authToken });
      setSelectedNightRoomReplies(data);
    } catch (err) {
      setActionMessage(err.message || "Failed to load 9-4 Room replies");
    }
  };

  if (!canAccess) {
    return <Navigate to="/regrets" replace />;
  }

  const PaginationControls = ({ pagination, onChangePage }) => {
    const currentPage = pagination?.page || 1;
    const totalPages = Math.max(1, pagination?.total_pages || 1);
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <span>
          Page {currentPage} of {totalPages} ({pagination?.total || 0} total)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onChangePage(currentPage - 1)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onChangePage(currentPage + 1)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white sm:px-6">
      <SeoMeta title="Admin Panel" description="Regrets.in admin controls." path="/osho" noIndex />
      <button
        type="button"
        onClick={() => setIsMobileSidebarOpen(true)}
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 lg:hidden"
      >
        <FaBars size={14} />
        Menu
      </button>
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
        />
      )}
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[220px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[260px] rounded-r-2xl border-r border-white/10 bg-slate-900/95 p-3 shadow-2xl transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:rounded-2xl lg:border lg:border-white/10 lg:bg-slate-900/60 lg:shadow-none ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <p className="text-sm font-semibold text-slate-100">Admin Menu</p>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800/80 text-slate-200"
            >
              <FaTimes size={13} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setActivePage("users")}
            className={`mb-2 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              activePage === "users" ? "bg-rose-500/20 text-rose-100" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <FaUsers size={13} />
            Users
          </button>
          <button
            type="button"
            onClick={() => setActivePage("regrets")}
            className={`mb-2 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              activePage === "regrets" ? "bg-rose-500/20 text-rose-100" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <FaRegCommentDots size={13} />
            Regrets
          </button>
          <button
            type="button"
            onClick={() => setActivePage("notifications")}
            className={`inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              activePage === "notifications" ? "bg-rose-500/20 text-rose-100" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <FaBell size={13} />
            Notification
          </button>
          <button
            type="button"
            onClick={() => setActivePage("feedback")}
            className={`mt-2 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              activePage === "feedback" ? "bg-rose-500/20 text-rose-100" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <FaInbox size={13} />
            Feedback
          </button>
          <button
            type="button"
            onClick={() => setActivePage("story-types")}
            className={`mt-2 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              activePage === "story-types" ? "bg-rose-500/20 text-rose-100" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <FaTags size={13} />
            Story Types
          </button>
          <button
            type="button"
            onClick={() => setActivePage("night-room")}
            className={`mt-2 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              activePage === "night-room" ? "bg-rose-500/20 text-rose-100" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <FaMoon size={13} />
            9-4 Room
          </button>
        </aside>

        <main className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h1 className="text-2xl font-semibold text-slate-100">Admin Panel</h1>
          {actionMessage && (
            <p className="mt-3 rounded-xl border border-emerald-300/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {actionMessage}
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}
        </section>

        {activePage === "notifications" && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-100">Send Admin Notification</h2>
          <form onSubmit={handleSendNotification} className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={notifyTarget === "all"}
                  onChange={() => setNotifyTarget("all")}
                  className="accent-rose-500"
                />
                All users
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={notifyTarget === "selected"}
                  onChange={() => setNotifyTarget("selected")}
                  className="accent-rose-500"
                />
                Selected users
              </label>
            </div>
            {notifyTarget === "selected" && (
              <div className="space-y-2 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <input
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  placeholder="Search recipients"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-rose-300/40"
                />
                <div className="max-h-36 space-y-1 overflow-y-auto pr-1">
                  {recipientUsers.map((u) => (
                    <label key={u.id} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-200 hover:bg-white/5">
                      <input
                        type="checkbox"
                        checked={notifyUserIds.includes(u.id)}
                        onChange={(e) => {
                          setNotifyUserIds((prev) =>
                            e.target.checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)
                          );
                        }}
                        className="accent-rose-500"
                      />
                      <span>{u.name}</span>
                      <span className="text-xs text-slate-400">({u.email})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <textarea
              value={notifyMessage}
              onChange={(e) => setNotifyMessage(e.target.value)}
              placeholder="Notification message"
              required
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-rose-300/40"
            />
            <button
              type="submit"
              disabled={sendingNotification || !notifyMessage.trim() || (notifyTarget === "selected" && notifyUserIds.length === 0)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-5 py-2 text-sm font-semibold text-white transition hover:from-rose-600 hover:to-rose-500 disabled:opacity-60"
            >
              <FaPaperPlane size={12} />
              {sendingNotification ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </section>
        )}

        {activePage === "feedback" && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-100">Feedback ({feedbacks.length})</h2>
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
              <FaSearch size={11} />
              <input
                value={feedbackSearch}
                onChange={(e) => {
                  setFeedbackPage(1);
                  setFeedbackSearch(e.target.value);
                }}
                placeholder="Search feedback"
                className="bg-transparent outline-none"
              />
            </label>
          </div>
          <div className="space-y-2">
            {feedbacks.map((f) => (
              <article key={f.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <p className="text-sm text-slate-100">{f.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {f.contact_email || "No email"} | {formatDateTime(f.created_at)}
                </p>
              </article>
            ))}
          </div>
          <PaginationControls pagination={feedbackPagination} onChangePage={setFeedbackPage} />
        </section>
        )}

        {activePage === "story-types" && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-100">Story Types</h2>
          <form onSubmit={handleCreateStoryType} className="mb-4 flex flex-wrap items-center gap-2">
            <input
              value={newStoryTypeName}
              onChange={(e) => setNewStoryTypeName(e.target.value)}
              placeholder="New story type name"
              className="min-w-[220px] flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm outline-none focus:border-rose-300/40"
            />
            <button
              type="submit"
              disabled={creatingStoryType || !newStoryTypeName.trim()}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-4 py-2 text-xs font-semibold text-white transition hover:from-rose-600 hover:to-rose-500 disabled:opacity-60"
            >
              {creatingStoryType ? "Adding..." : "Add Story Type"}
            </button>
          </form>
          <div className="space-y-2">
            {storyTypes.map((category) => (
              <article key={category.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <p className="text-sm text-slate-100">{category.name}</p>
                <p className="mt-1 text-xs text-slate-400">ID: {category.id} | Slug: {category.slug}</p>
              </article>
            ))}
          </div>
        </section>
        )}

        {activePage === "night-room" && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-100">9-4 Room ({nightRoomPosts.length})</h2>
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
              <FaSearch size={11} />
              <input
                value={nightRoomSearch}
                onChange={(e) => {
                  setNightRoomPage(1);
                  setNightRoomSearch(e.target.value);
                }}
                placeholder="Search 9-4 posts"
                className="bg-transparent outline-none"
              />
            </label>
          </div>

          <div className="mb-4 rounded-xl border border-white/10 bg-slate-950/50 p-3">
            <p className="mb-2 text-xs text-slate-300">Current mode: <span className="font-semibold text-slate-100">{nightRoomSetting.mode}</span> | Open now: <span className="font-semibold text-slate-100">{nightRoomSetting.is_open ? "Yes" : "No"}</span></p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleNightRoomModeChange("auto")}
                disabled={updatingNightRoomMode}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                Auto (9PM-4AM)
              </button>
              <button
                type="button"
                onClick={() => handleNightRoomModeChange("force_on")}
                disabled={updatingNightRoomMode}
                className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
              >
                Force ON
              </button>
              <button
                type="button"
                onClick={() => handleNightRoomModeChange("force_off")}
                disabled={updatingNightRoomMode}
                className="rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-200"
              >
                Force OFF
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {nightRoomPosts.map((post) => (
              <article key={post.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-100">{post.title}</p>
                    <p className="text-xs text-slate-400">
                      Posted by: {post.is_anonymous ? "Anonymous" : post.user?.name || "Unknown"} ({post.user?.email || "N/A"}) | {formatDateTime(post.created_at)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Likes: {post.likes_count || 0} | Replies: {post.replies_count || 0}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openNightRoomReplies(post.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Replies
                  </button>
                </div>
              </article>
            ))}
          </div>

          <PaginationControls pagination={nightRoomPagination} onChangePage={setNightRoomPage} />

          {selectedNightRoomReplies && (
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/55 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">
                  Replies for: {selectedNightRoomReplies.post?.title}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedNightRoomReplies(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {(selectedNightRoomReplies.replies || []).map((reply) => (
                  <div key={reply.id} className="rounded-lg border border-white/10 bg-slate-900/45 px-3 py-2 text-xs text-slate-300">
                    <p className="text-sm text-slate-100">{reply.title}</p>
                    <p className="mt-1">
                      {reply.is_anonymous ? "Anonymous" : `${reply.user?.name || "Unknown"} (${reply.user?.email || "N/A"})`}
                    </p>
                    <p className="mt-1">{formatDateTime(reply.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        )}

        {activePage === "users" && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-100">Users ({users.length})</h2>
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
              <FaSearch size={11} />
              <input
                value={userSearch}
                onChange={(e) => {
                  setUsersPage(1);
                  setUserSearch(e.target.value);
                }}
                placeholder="Search users"
                className="bg-transparent outline-none"
              />
            </label>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
              Total users: {userStats.total_users}
            </span>
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
              Joined today: {userStats.joined_today}
            </span>
          </div>
          {loading ? (
            <p className="text-sm text-slate-400">Loading users...</p>
          ) : (
            <>
            <div className="space-y-2 md:hidden">
              {users.map((u) => (
                <article key={u.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-sm font-semibold text-slate-100">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                  <p className="mt-2 text-xs text-slate-300">
                    Joined: {formatDateTime(u.created_at)} | Regrets: {u.regrets_count} | Replies: {u.replies_count}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openUserPosts(u.id)}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      View Posts
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u.id)}
                      className="rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Joined</th>
                    <th className="py-2 pr-3">Regrets</th>
                    <th className="py-2 pr-3">Replies</th>
                    <th className="py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 text-slate-200">
                      <td className="py-2 pr-3">{u.name}</td>
                      <td className="py-2 pr-3">{u.email}</td>
                      <td className="py-2 pr-3">{formatDateTime(u.created_at)}</td>
                      <td className="py-2 pr-3">{u.regrets_count}</td>
                      <td className="py-2 pr-3">{u.replies_count}</td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openUserPosts(u.id)}
                            className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-slate-200 hover:bg-white/10"
                          >
                            View Posts
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="rounded-full border border-rose-300/30 bg-rose-500/10 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls pagination={usersPagination} onChangePage={setUsersPage} />
            </>
          )}
          {selectedUserPosts && (
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/55 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">
                  Posts by {selectedUserPosts.user?.name} ({selectedUserPosts.user?.email})
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedUserPosts(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {(selectedUserPosts.posts || []).map((post) => (
                  <div key={post.id} className="rounded-lg border border-white/10 bg-slate-900/45 px-3 py-2 text-xs text-slate-300">
                    <p className="text-sm text-slate-100">{post.title}</p>
                    <p className="mt-1">{formatDateTime(post.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        )}

        {activePage === "regrets" && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-100">Regrets ({questions.length})</h2>
            <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
              <FaSearch size={11} />
              <input
                value={questionSearch}
                onChange={(e) => {
                  setQuestionsPage(1);
                  setQuestionSearch(e.target.value);
                }}
                placeholder="Search regrets"
                className="bg-transparent outline-none"
              />
            </label>
          </div>
          {loading ? (
            <p className="text-sm text-slate-400">Loading regrets...</p>
          ) : (
            <div className="space-y-2">
              {questions.map((q) => (
                <article key={q.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-100">{q.title}</p>
                      <p className="text-xs text-slate-400">
                        Posted by: {q.is_anonymous ? "Anonymous" : q.user?.name || "Unknown"} ({q.user?.email || "N/A"}) | {formatDateTime(q.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openRegretReplies(q.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                      >
                        Replies
                      </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                    >
                      <FaTrashAlt size={11} />
                      Delete
                    </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <PaginationControls pagination={questionsPagination} onChangePage={setQuestionsPage} />
          {selectedQuestionReplies && (
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/55 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">
                  Replies for: {selectedQuestionReplies.question?.title}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedQuestionReplies(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {(selectedQuestionReplies.replies || []).map((reply) => (
                  <div key={reply.id} className="rounded-lg border border-white/10 bg-slate-900/45 px-3 py-2 text-xs text-slate-300">
                    <p className="text-sm text-slate-100">{reply.title}</p>
                    <p className="mt-1">
                      {reply.is_anonymous ? "Anonymous" : `${reply.user?.name || "Unknown"} (${reply.user?.email || "N/A"})`}
                    </p>
                    <p className="mt-1">{formatDateTime(reply.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        )}

        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
