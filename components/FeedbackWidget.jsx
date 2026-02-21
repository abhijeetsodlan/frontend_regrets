import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaCommentDots, FaTimes } from "react-icons/fa";

const API_BASE_URL = "http://localhost:3000/api";

const FeedbackWidget = ({ showFloating = true, renderTrigger = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  const token = localStorage.getItem("auth_token");
  const storedEmail = localStorage.getItem("useremail") || "";
  const isLoggedIn = Boolean(token && storedEmail);

  const closeModal = () => {
    setIsOpen(false);
    setStatus("");
  };

  const showSuccessToast = (messageText) => {
    setToastMessage(messageText);
    setShowToast(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch(`${API_BASE_URL}/feedback${storedEmail ? `?email=${encodeURIComponent(storedEmail)}` : ""}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          type: "general",
          message: message.trim(),
          contact_email: isLoggedIn ? storedEmail : guestEmail.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setMessage("");
      setGuestEmail("");
      closeModal();
      showSuccessToast("Feedback submitted");
    } catch {
      setStatus("Could not submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {renderTrigger
        ? renderTrigger(() => setIsOpen(true))
        : showFloating && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-rose-300/35 bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(251,113,133,0.35)] transition hover:bg-rose-600 sm:bottom-5 sm:left-5"
          >
            <FaCommentDots size={13} />
            Feedback
          </button>
        )}

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Share feedback"
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/95 p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <FaTimes size={12} />
              </button>

              <h3 className="text-xl font-semibold text-slate-100">Share your feedback</h3>
              <p className="mt-1 text-sm text-slate-400">
                Review the site, suggest improvements, or tell us anything.
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write your message..."
                  rows={5}
                  maxLength={1000}
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-rose-300/50 focus:ring-2 focus:ring-rose-400/25"
                />

                {!isLoggedIn && (
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                    placeholder="Your email (required)"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-rose-300/50 focus:ring-2 focus:ring-rose-400/25"
                  />
                )}

                {status && (
                  <p className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                    {status}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-4 py-2 text-xs font-semibold text-white transition hover:from-rose-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {showToast && (
        <div className="fixed right-4 top-20 z-[85] rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 shadow-[0_12px_28px_rgba(16,185,129,0.25)]">
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
