import React from "react";
import { createPortal } from "react-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutRequest, requestCsrfCookie } from "../src/services/authService";

const Logout = ({ onLogout }) => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const closeConfirm = () => {
    if (isSubmitting) {
      return;
    }
    setIsConfirmOpen(false);
  };

  const handleConfirmLogout = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const token = localStorage.getItem("auth_token");
    const storedEmail = localStorage.getItem("useremail");

    // Complete local logout immediately so UI never gets stuck waiting on API.
    localStorage.removeItem("auth_token");
    localStorage.removeItem("useremail");
    sessionStorage.setItem("logout_success", "1");
    setIsConfirmOpen(false);
    if (onLogout) {
      onLogout(storedEmail || "");
    }
    setIsSubmitting(false);
    window.location.assign("/regrets");

    if (token) {
      try {
        await requestCsrfCookie();
        await logoutRequest({ token });
      } catch {
        // Ignore backend logout errors; user is already logged out locally.
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsConfirmOpen(true)}
        className="block w-full rounded-lg px-4 py-2 text-center text-gray-200 transition-all duration-200 hover:bg-gray-700 hover:text-white"
      >
        Logout
      </button>

      {isConfirmOpen && createPortal(
        <div
          data-logout-modal="true"
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Logout confirmation"
          onClick={closeConfirm}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-rose-300/20 bg-slate-950/95 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-300/35 bg-rose-500/15 text-rose-200">
              <FaSignOutAlt size={16} />
            </div>

            <h3 className="text-lg font-semibold text-slate-100">Logout?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Are you sure you want to logout from this account?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeConfirm}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isSubmitting}
                className="inline-flex h-10 min-w-[128px] items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-5 text-sm font-semibold text-white transition hover:from-rose-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Logout;
