import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegBookmark, FaRegFileAlt, FaAt } from "react-icons/fa";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("uploaded");
  const [user, setUser] = useState({ name: "", email: "" });
  const [uploadedPosts, setUploadedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userEmail = localStorage.getItem("useremail");
        const authToken = localStorage.getItem("auth_token");

        if (!userEmail || !authToken) {
          throw new Error("User not authenticated");
        }

        const response = await fetch("http://localhost:3000/api/myprofile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ email: userEmail })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUser({
          name: data.data.name || "",
          email: data.data.email || ""
        });
        setUploadedPosts(data.data.uploaded_posts || []);
        setSavedPosts(data.data.saved_posts || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const nameInitial = useMemo(() => {
    const value = user.name?.trim();
    return value ? value.charAt(0).toUpperCase() : "U";
  }, [user.name]);

  const currentPosts = activeTab === "uploaded" ? uploadedPosts : savedPosts;
  const handleRegretClick = (postId) => navigate(`/regrets/${postId}`);
  const handleBackClick = () => navigate(-1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-28 rounded-2xl border border-white/10 bg-slate-900/55" />
          <div className="h-12 rounded-2xl border border-white/10 bg-slate-900/55" />
          <div className="h-20 rounded-xl border border-white/10 bg-slate-900/55" />
          <div className="h-20 rounded-xl border border-white/10 bg-slate-900/55" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 text-center text-rose-200">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <button
          onClick={handleBackClick}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-300/30 hover:bg-slate-800 hover:text-rose-100"
        >
          <FaArrowLeft size={12} />
          Back
        </button>

        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-rose-400/14 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-rose-300/10 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-rose-200/35 bg-gradient-to-br from-rose-500/20 to-rose-300/10 text-2xl font-bold text-rose-100 shadow-[0_8px_25px_rgba(251,113,133,0.24)]">
                <span className="absolute inset-0 rounded-full border border-white/10" />
                {nameInitial}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-slate-100">{user.name || "Anonymous User"}</h2>
                <p className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <FaAt size={11} />
                  {user.email || "No email available"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-3 shadow-[0_14px_35px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/45 p-1">
            <button
              onClick={() => setActiveTab("uploaded")}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium transition ${
                activeTab === "uploaded"
                  ? "bg-gradient-to-r from-rose-500/25 to-rose-300/20 text-rose-100 shadow-[0_8px_20px_rgba(251,113,133,0.2)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FaRegFileAlt size={13} />
              Your Regrets
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium transition ${
                activeTab === "saved"
                  ? "bg-gradient-to-r from-rose-500/25 to-rose-300/20 text-rose-100 shadow-[0_8px_20px_rgba(251,113,133,0.2)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FaRegBookmark size={13} />
              Saved
            </button>
          </div>
        </section>

        <section className="mt-5 space-y-3">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => handleRegretClick(post.id)}
                className="group cursor-pointer rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow-[0_14px_35px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/30 hover:bg-slate-900/80"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="line-clamp-2 text-sm leading-6 text-slate-200 sm:text-base">
                    {post.title}
                  </p>
                  <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400 transition group-hover:border-rose-300/35 group-hover:text-slate-200">
                    Open
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
              {activeTab === "uploaded"
                ? "No regrets posted yet."
                : "No saved regrets yet."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
