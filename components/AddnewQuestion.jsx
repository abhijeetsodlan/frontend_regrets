import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaUserSecret } from "react-icons/fa";

export default function CreateQuestionModal({ onClose, onQuestionCreated }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories");
        setCategories(response.data.data || []);
      } catch (_err) {
        setError("Failed to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        title,
        category_id: parseInt(categoryId, 10)
      };

      if (isAnonymous) {
        requestData.is_anonymous = 1;
      }

      const response = await axios.post("http://localhost:3000/api/question", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });
      if (onQuestionCreated && response.data?.question) {
        onQuestionCreated(response.data.question);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = title.trim().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/95 p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-6">
        <div className="pointer-events-none absolute left-[-45px] top-[-45px] h-36 w-36 rounded-full bg-rose-400/16 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-40px] right-[-30px] h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mb-3 flex items-center justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {categoriesLoading ? (
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
            Loading categories...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-4">
            <div>
              <label htmlFor="regret-title" className="mb-2 block text-sm font-medium text-slate-200">
                Regret
              </label>
              <textarea
                id="regret-title"
                placeholder="Write what happened..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={4}
                maxLength={300}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-rose-300/50 focus:ring-2 focus:ring-rose-400/25"
                required
              />
              <div className="mt-1 text-right text-xs text-slate-500">{charCount}/300</div>
            </div>

            <div>
              <label htmlFor="regret-category" className="mb-2 block text-sm font-medium text-slate-200">
                Story Type
              </label>
              <select
                id="regret-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-base text-white outline-none transition focus:border-rose-300/50 focus:ring-2 focus:ring-rose-400/25"
                required
              >
                <option value="" disabled>
                  Select Story Type
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 accent-rose-500"
              />
              <FaUserSecret size={14} className="text-slate-400" />
              Post as anonymous
            </label>

            {error && (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium tracking-wide text-slate-100 transition hover:border-white/30 hover:bg-white/10"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-11 min-w-[138px] items-center justify-center rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-6 text-sm font-semibold tracking-wide text-white shadow-[0_10px_24px_rgba(251,113,133,0.3)] transition hover:from-rose-600 hover:via-rose-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Post Regret"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
