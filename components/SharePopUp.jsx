import React, { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaLink,
  FaTimes,
  FaShareAlt
} from "react-icons/fa";

const SharePopup = ({ regretId, regretTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `${window.location.origin}/regrets/${regretId}`;
  const shareText = `Check out this regret: "${regretTitle}" on Regrets.in`;

  const togglePopup = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const copyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsOpen(false);
    } catch (_err) {
      // Ignore clipboard errors silently.
    }
  };

  const shareViaNavigator = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title: regretTitle, text: shareText, url: shareUrl });
      } catch (_error) {
        // no-op
      }
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const shareToWhatsApp = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank");
    setIsOpen(false);
  };

  const shareToTwitter = (e) => {
    e.stopPropagation();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
    setIsOpen(false);
  };

  const shareToInstagram = (e) => {
    e.stopPropagation();
    copyToClipboard(e);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && event.target.closest(".share-popup") === null) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const baseButtonClass =
    "inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-slate-900/55 px-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-slate-800 hover:text-white";

  return (
    <div className="relative">
      <button onClick={navigator.share ? shareViaNavigator : togglePopup} className={baseButtonClass}>
        <FaShareAlt size={14} />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="share-popup relative z-10 w-[92%] max-w-sm rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl">
            <button
              onClick={togglePopup}
              className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <FaTimes size={14} />
            </button>
            <h3 className="mb-4 text-lg font-semibold text-slate-100">Share this regret</h3>
            <div className="grid gap-2">
              <button
                onClick={shareToWhatsApp}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500"
              >
                <FaWhatsapp size={14} />
                WhatsApp
              </button>
              <button
                onClick={shareToInstagram}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                <FaInstagram size={14} />
                Instagram
              </button>
              <button
                onClick={shareToTwitter}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
              >
                <FaTwitter size={14} />
                Twitter (X)
              </button>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
              >
                <FaLink size={14} />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePopup;

