import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaCommentDots, FaDoorOpen, FaArrowLeft } from "react-icons/fa";
import LoginModal from "./Login";
import Logout from "./Logout"; // Import the Logout component
import FeedbackWidget from "./FeedbackWidget";
import {
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from "../src/services/notificationService";
import { getMe } from "../src/services/userService";
import { buildWsUrl } from "../src/services/config";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [animateFeedback, setAnimateFeedback] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isEnteringNightRoom, setIsEnteringNightRoom] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileInitial, setProfileInitial] = useState("U");
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const bellTimeoutRef = useRef(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    const storedEmail = localStorage.getItem("useremail");
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const data = await getNotifications({ token, email: storedEmail || "" });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      // Silent fail for navbar polling.
    }
  };

  const formatNotificationTime = (value) => {
    const createdAt = new Date(value).getTime();
    if (Number.isNaN(createdAt)) return "";
    const diffMs = Date.now() - createdAt;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleNotificationClick = async (notification) => {
    const token = localStorage.getItem("auth_token");
    const storedEmail = localStorage.getItem("useremail");
    const targetQuestionId =
      notification?.question_id ||
      notification?.question?.id ||
      notification?.question?._id ||
      null;

    if (!notification?.id || !targetQuestionId) {
      return;
    }

    if (token && !notification.is_read) {
      try {
        await markNotificationRead(notification.id, { token, email: storedEmail || "" });
      } catch {
        // Keep navigation even when mark-read fails.
      }
    }

    setNotifications((prev) =>
      prev.map((row) => (row.id === notification.id ? { ...row, is_read: true } : row))
    );
    setUnreadCount((prev) => Math.max(0, prev - (notification.is_read ? 0 : 1)));
    setNotificationsOpen(false);
    navigate(`/regrets/${targetQuestionId}`);
  };

  const handleClearNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    const storedEmail = localStorage.getItem("useremail");
    if (!token) {
      return;
    }

    try {
      await clearNotifications({ token, email: storedEmail || "" });
      setNotifications([]);
      setUnreadCount(0);
    } catch {
      // Silent fail to keep navbar responsive.
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    const token = localStorage.getItem("auth_token");
    const storedEmail = localStorage.getItem("useremail");
    if (!token || unreadCount <= 0) {
      return;
    }

    try {
      await markAllNotificationsRead({ token, email: storedEmail || "" });
      setNotifications((prev) => prev.map((row) => ({ ...row, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Silent fail to keep navbar responsive.
    }
  };

  const triggerBellAnimation = () => {
    setAnimateBell(true);
    if (bellTimeoutRef.current) {
      clearTimeout(bellTimeoutRef.current);
    }
    bellTimeoutRef.current = setTimeout(() => {
      setAnimateBell(false);
    }, 1700);
  };

  const getAvatarSkipKey = (email) => `avatar_onboarding_skipped_${email || "unknown"}`;

  const syncProfileButton = () => {
    const avatar = localStorage.getItem("user_avatar") || "";
    const userName = (localStorage.getItem("username") || localStorage.getItem("user_name") || "").trim();
    const userEmail = (localStorage.getItem("useremail") || "").trim();
    const initialSource = userName || userEmail || "U";
    setProfileAvatar(avatar);
    setProfileInitial(initialSource.charAt(0).toUpperCase());
  };

  const checkAvatarOnboarding = async () => {
    const token = localStorage.getItem("auth_token");
    const storedEmail = localStorage.getItem("useremail");
    if (!token) {
      return;
    }

    try {
      const data = await getMe({ token, email: storedEmail || "" });
      const avatar = data?.user?.avatar || "";
      const userName = data?.user?.name || "";
      localStorage.setItem("user_avatar", avatar);
      if (userName) {
        localStorage.setItem("user_name", userName);
      }
      syncProfileButton();
      const wasSkipped = localStorage.getItem(getAvatarSkipKey(storedEmail)) === "1";
      const shouldRedirect = !avatar && !wasSkipped && location.pathname !== "/choose-avatar";
      if (shouldRedirect) {
        navigate("/choose-avatar", { replace: true });
      }
    } catch {
      // Silent fail for onboarding check.
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
    syncProfileButton();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
    syncProfileButton();
    if (token) {
      checkAvatarOnboarding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoggedIn) {
      return undefined;
    }

    fetchNotifications();
    const timer = setInterval(fetchNotifications, 20000);
    return () => clearInterval(timer);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      return undefined;
    }

    let cancelled = false;

    const connectSocket = () => {
      const token = localStorage.getItem("auth_token");
      if (!token || cancelled) {
        return;
      }

      const wsUrl = buildWsUrl("/ws", { token });
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data || "{}");
          if (payload.type !== "notification:new" || !payload.notification) {
            return;
          }

          const incoming = payload.notification;
          setNotifications((prev) => {
            const alreadyExists = prev.some((row) => row.id === incoming.id);
            if (alreadyExists) {
              return prev;
            }
            return [incoming, ...prev].slice(0, 50);
          });
          setUnreadCount((prev) => prev + 1);
          triggerBellAnimation();
        } catch {
          // Ignore malformed event payloads.
        }
      };

      socket.onclose = () => {
        if (cancelled) {
          return;
        }
        reconnectTimeoutRef.current = setTimeout(connectSocket, 2500);
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connectSocket();

    return () => {
      cancelled = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (bellTimeoutRef.current) {
        clearTimeout(bellTimeoutRef.current);
      }
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setAnimateFeedback(true);
      setTimeout(() => setAnimateFeedback(false), 1800);
    }, 12000);

    return () => clearInterval(intervalRef);
  }, []);

  // Callback to handle logout success
  const handleLogoutSuccess = () => {
    const storedEmail = localStorage.getItem("useremail");
    setIsLoggedIn(false);
    setMenuOpen(false);
    setNotificationsOpen(false);
    setNotifications([]);
    setUnreadCount(0);
    setProfileAvatar("");
    setProfileInitial("U");
    localStorage.removeItem("user_avatar");
    localStorage.removeItem("user_name");
    if (storedEmail) {
      localStorage.removeItem(getAvatarSkipKey(storedEmail));
    }
  };

  const handleEnterNightRoom = () => {
    setMenuOpen(false);
    setNotificationsOpen(false);
    if (isEnteringNightRoom) {
      return;
    }
    setIsEnteringNightRoom(true);
    setTimeout(() => {
      navigate("/9-4-room");
      setTimeout(() => setIsEnteringNightRoom(false), 260);
    }, 360);
  };

  const isOnNightRoomRoute = location.pathname.startsWith("/9-4-room");

  return (
    <nav className="w-full bg-black/40 backdrop-blur-md text-white py-4 shadow-lg sticky top-0 z-50 border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Website Name */}
        <Link
          to="/"
          className="text-2xl font-bold text-rose-500 hover:text-rose-400 transition-all duration-300"
        >
          Regrets.in
        </Link>

        {/* Right Side: User Icon or Login Button */}
        <div className="flex items-center gap-3">
          {isOnNightRoomRoute ? (
            <button
              type="button"
              onClick={() => navigate("/regrets")}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-500/10 text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-500/20"
              aria-label="Back to regrets"
              title="Back to regrets"
            >
              <FaArrowLeft size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEnterNightRoom}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-500/10 text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-500/20"
              aria-label="Enter The 9-4 Room"
              title="Enter The 9-4 Room"
            >
              <FaDoorOpen size={14} />
            </button>
          )}

          <FeedbackWidget
            showFloating={false}
            renderTrigger={(openFeedback) => (
              <button
                type="button"
                onClick={() => {
                  openFeedback();
                  setMenuOpen(false);
                  setNotificationsOpen(false);
                }}
                className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-slate-200 transition hover:border-rose-400/40 hover:text-rose-300 ${
                  animateFeedback ? "animate-bounce border-rose-300/50 text-rose-300 shadow-[0_0_0_4px_rgba(251,113,133,0.18)]" : ""
                }`}
                aria-label="Give feedback"
                title="Give feedback"
              >
                <FaCommentDots size={15} />
              </button>
            )}
          />

          {isLoggedIn ? (
            <>
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-slate-200 transition hover:border-rose-400/40 hover:text-rose-300 ${
                    animateBell ? "animate-bounce border-rose-300/50 text-rose-300 shadow-[0_0_0_4px_rgba(251,113,133,0.18)]" : ""
                  }`}
                  onClick={() => {
                    setNotificationsOpen((prev) => !prev);
                    setMenuOpen(false);
                  }}
                >
                  <FaBell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1.5 text-center text-[10px] font-bold leading-5 text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="fixed left-3 right-3 top-16 z-[70] rounded-xl border border-gray-700 bg-black/85 p-2 shadow-2xl backdrop-blur-md sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[22rem] sm:max-w-[92vw]">
                    <div className="mb-2 flex items-center justify-between px-2">
                      <p className="text-sm font-semibold text-slate-100">Notifications</p>
                      {notifications.length > 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleMarkAllNotificationsRead}
                            disabled={unreadCount <= 0}
                            className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-slate-300 transition hover:border-rose-300/40 hover:text-rose-100 disabled:opacity-50"
                          >
                            Mark read
                          </button>
                          <button
                            type="button"
                            onClick={handleClearNotifications}
                            className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-slate-300 transition hover:border-rose-300/40 hover:text-rose-100"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="rounded-lg bg-slate-900/50 px-3 py-4 text-center text-sm text-slate-400">
                        No notifications yet.
                      </p>
                    ) : (
                      <div className="max-h-[60vh] space-y-1 overflow-y-auto pr-1 sm:max-h-80">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                              notification.is_read
                                ? "border-white/5 bg-slate-900/35 text-slate-300 hover:bg-slate-900/60"
                                : "border-rose-400/25 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                            }`}
                          >
                            <p className="text-sm leading-5">{notification.message}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatNotificationTime(notification.created_at)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-rose-500 text-sm font-bold text-white transition hover:border-rose-300/50 hover:bg-rose-400"
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                    setNotificationsOpen(false);
                  }}
                  aria-label="Open profile menu"
                  title="My profile"
                >
                  {profileAvatar ? (
                    <span className="text-lg leading-none">{profileAvatar}</span>
                  ) : (
                    <span>{profileInitial}</span>
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-black/70 backdrop-blur-md rounded-xl shadow-2xl p-3 transition-all duration-300 transform origin-top scale-100 opacity-100 border border-gray-700">
                    <Link
                      to="/myProfile"
                      className="block w-full text-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Logout onLogout={handleLogoutSuccess} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              className="bg-rose-500 px-6 py-2 rounded-full font-medium text-white hover:bg-rose-600 shadow-lg transition-all duration-300 hover:shadow-rose-500/20"
              onClick={() => setLoginModalOpen(true)}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {isEnteringNightRoom && (
        <div className="pointer-events-none fixed inset-0 z-[120] bg-gradient-to-b from-[#03040b] via-[#090d1e] to-[#120c1d] opacity-95 transition-opacity duration-500">
          <div className="flex h-full w-full items-center justify-center text-cyan-100">
            <div className="rounded-full border border-cyan-200/25 bg-cyan-500/10 px-5 py-2 text-sm tracking-wide">
              Entering The 9-4 Room
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
