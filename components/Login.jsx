import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", user);
      if (email) {
        localStorage.setItem("useremail", email);
      }
      navigate("/regrets");
    }
  }, [navigate]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Login"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#131723] via-[#0f1320] to-[#0a0d16] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute right-4 top-3 text-2xl text-slate-400 transition hover:text-white"
          onClick={onClose}
          aria-label="Close login modal"
        >
          &times;
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-400/30">
            <span className="text-xl text-red-400">R</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to continue sharing and reading regrets.
          </p>
        </div>

        <a
          href="http://localhost:3000/auth/google"
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300/60 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            alt="Google logo"
            className="h-5 w-5"
          />
          <span>Continue with Google</span>
        </a>

        <p className="mt-4 text-center text-xs text-slate-400">
          We only use your basic profile details for account access.
        </p>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
