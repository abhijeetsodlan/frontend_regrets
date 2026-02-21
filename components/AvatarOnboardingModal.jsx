import React, { useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";

const AVATAR_OPTIONS = [
  { value: "\u{1F468}", label: "Boy 1" },
  { value: "\u{1F466}", label: "Boy 2" },
  { value: "\u{1F9D1}", label: "Boy 3" },
  { value: "\u{1F469}", label: "Girl 1" },
  { value: "\u{1F467}", label: "Girl 2" },
  { value: "\u{1F471}\u200D\u2640\uFE0F", label: "Girl 3" },
  { value: "\u{1F9D4}", label: "Style 1" },
  { value: "\u{1F9D5}", label: "Style 2" },
  { value: "\u{1F471}", label: "Style 3" },
  { value: "\u{1F468}\u200D\u{1F9B0}", label: "Style 4" },
  { value: "\u{1F469}\u200D\u{1F9B1}", label: "Style 5" },
  { value: "\u{1F468}\u200D\u{1F9B3}", label: "Style 6" },
  { value: "\u{1F469}\u200D\u{1F9B2}", label: "Style 7" },
  { value: "\u{1F9D3}", label: "Style 8" },
  { value: "\u{1F9CF}", label: "Style 9" },
  { value: "\u{1F935}", label: "Style 10" },
  { value: "\u{1F478}", label: "Style 11" },
  { value: "\u{1F934}", label: "Style 12" }
];

const AvatarOnboardingModal = ({
  isOpen,
  inline = false,
  onSaved,
  onSkip,
  showSkip = true,
  secondaryLabel = "Skip",
  title = "Choose your avatar",
  subtitle = "Pick one avatar to continue. You can keep using it permanently.",
  saveLabel = "Save Avatar"
}) => {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    const token = localStorage.getItem("auth_token");
    const storedEmail = localStorage.getItem("useremail");
    if (!token || !selected || saving) {
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/me/avatar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: selected, email: storedEmail })
      });

      if (!response.ok) {
        throw new Error("Failed to save avatar");
      }

      localStorage.setItem("user_avatar", selected);
      if (onSaved) {
        onSaved(selected);
      }
    } catch {
      setError("Could not save avatar. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div className="my-auto w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-6">
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {subtitle}
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          {AVATAR_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              className={`flex h-12 items-center justify-center rounded-xl border text-2xl transition sm:h-14 ${
                selected === option.value
                  ? "border-rose-300/50 bg-rose-500/15"
                  : "border-white/10 bg-slate-900/70 hover:border-white/25"
              }`}
              title={option.label}
            >
              {option.value}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {showSkip && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={saving}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {secondaryLabel}
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!selected || saving}
            className="rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-5 py-2 text-sm font-semibold text-white transition hover:from-rose-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : saveLabel}
          </button>
        </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-4">
      {content}
    </div>
  );
};

export default AvatarOnboardingModal;
