import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegBookmark, FaRegFileAlt, FaAt, FaEdit, FaUserEdit } from "react-icons/fa";
import SeoMeta from "../../components/SeoMeta";
import AvatarOnboardingModal from "../../components/AvatarOnboardingModal";

const API_BASE_URL = "http://localhost:3000/api";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("uploaded");
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [uploadedPosts, setUploadedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
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

        const response = await fetch(`${API_BASE_URL}/myprofile`, {
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
          email: data.data.email || "",
          avatar: data.data.avatar || ""
        });
        setDraftName(data.data.name || "");
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

  const saveProfile = async () => {
    const authToken = localStorage.getItem("auth_token");
    const userEmail = localStorage.getItem("useremail");
    const trimmedName = draftName.trim();
    if (!authToken || !trimmedName || savingProfile) {
      return;
    }

    setSavingProfile(true);
    setProfileMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ name: trimmedName, email: userEmail })
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      const updatedName = data?.user?.name || trimmedName;
      setUser((prev) => ({ ...prev, name: updatedName }));
      localStorage.setItem("user_name", updatedName);
      setEditingProfile(false);
      setProfileMessage("Profile updated");
    } catch {
      setProfileMessage("Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title || "");
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
  };

  const saveEdit = async (postId) => {
    const authToken = localStorage.getItem("auth_token");
    const userEmail = localStorage.getItem("useremail");
    const trimmedTitle = editTitle.trim();

    if (!authToken || !trimmedTitle || savingEdit) {
      return;
    }

    setSavingEdit(true);
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ title: trimmedTitle, email: userEmail })
      });

      if (!response.ok) {
        throw new Error("Failed to update regret");
      }

      setUploadedPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, title: trimmedTitle } : post))
      );
      setSavedPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, title: trimmedTitle } : post))
      );
      cancelEdit();
    } catch {
      // Keep quiet to avoid breaking navigation flow.
    } finally {
      setSavingEdit(false);
    }
  };

  const seoMeta = (
    <SeoMeta
      title="My Profile"
      description="Manage your posted and saved regrets on your Regrets.in profile."
      path="/myprofile"
      noIndex
    />
  );

  if (loading) {
    return (
      <>
        {seoMeta}
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-28 rounded-2xl border border-white/10 bg-slate-900/55" />
            <div className="h-12 rounded-2xl border border-white/10 bg-slate-900/55" />
            <div className="h-20 rounded-xl border border-white/10 bg-slate-900/55" />
            <div className="h-20 rounded-xl border border-white/10 bg-slate-900/55" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {seoMeta}
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white">
          <div className="mx-auto max-w-3xl rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 text-center text-rose-200">
            Error: {error}
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
                {user.avatar ? <span className="text-3xl leading-none">{user.avatar}</span> : nameInitial}
              </div>
              <div className="space-y-1">
                {editingProfile ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      maxLength={80}
                      className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-rose-300/40"
                      placeholder="Your name"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProfile(false);
                          setDraftName(user.name || "");
                          setProfileMessage("");
                        }}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveProfile}
                        disabled={!draftName.trim() || savingProfile}
                        className="rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-3 py-1 text-xs font-semibold text-white transition hover:from-rose-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingProfile ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <h2 className="text-2xl font-semibold text-slate-100">{user.name || "Anonymous User"}</h2>
                )}
                <p className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <FaAt size={11} />
                  {user.email || "No email available"}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-500/20"
                  >
                    <FaUserEdit size={11} />
                    Edit Name
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-500/20"
                  >
                    <FaEdit size={11} />
                    Change Avatar
                  </button>
                </div>
                {profileMessage && (
                  <p className="text-xs text-slate-300">{profileMessage}</p>
                )}
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
                  {activeTab === "uploaded" && editingPostId === post.id ? (
                    <div className="flex w-full flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        maxLength={280}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-rose-400/40"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-slate-300 transition hover:border-white/30 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingEdit || !editTitle.trim()}
                          onClick={() => saveEdit(post.id)}
                          className="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="line-clamp-2 text-sm leading-6 text-slate-200 sm:text-base">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2">
                        {activeTab === "uploaded" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(post);
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300 transition hover:border-rose-300/40 hover:text-rose-100"
                          >
                            <FaEdit size={11} />
                            Edit
                          </button>
                        )}
                        <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400 transition group-hover:border-rose-300/35 group-hover:text-slate-200">
                          Open
                        </span>
                      </div>
                    </>
                  )}
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
      <AvatarOnboardingModal
        isOpen={showAvatarModal}
        showSkip
        secondaryLabel="Cancel"
        title="Change your avatar"
        subtitle="Pick a new avatar for your profile."
        saveLabel="Update Avatar"
        onSkip={() => setShowAvatarModal(false)}
        onSaved={(avatarValue) => {
          localStorage.setItem("user_avatar", avatarValue);
          setUser((prev) => ({ ...prev, avatar: avatarValue }));
          setShowAvatarModal(false);
        }}
      />
    </div>
  );
};

export default UserProfile;
