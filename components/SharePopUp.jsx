import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaTwitter, FaLink, FaTimes, FaShareAlt } from "react-icons/fa";

const SharePopup = ({ regretId, regretTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `http://localhost:5173/regrets/${regretId}`;
  const shareText = `Check out this regret: "${regretTitle}" on Regrets.in`;

  const togglePopup = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!");
      setIsOpen(false);
    });
  };

  const shareViaNavigator = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title: regretTitle, text: shareText, url: shareUrl });
        setIsOpen(false);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      togglePopup(e);
    }
  };

  const shareToWhatsApp = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank");
    setIsOpen(false);
  };

  const shareToInstagram = (e) => {
    e.stopPropagation();
    copyToClipboard(e);
    alert("Link copied! Paste it into Instagram to share.");
  };

  const shareToTwitter = (e) => {
    e.stopPropagation();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
    setIsOpen(false);
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

  return (
    <div className="relative">
      <button
        onClick={navigator.share ? shareViaNavigator : togglePopup}
        className="flex items-center px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition"
      >
        <FaShareAlt size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="share-popup relative bg-white dark:bg-gray-900 rounded-xl p-6 w-80 max-w-sm shadow-2xl z-10">
            <button
              onClick={togglePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition"
            >
              <FaTimes size={18} />
            </button>
            <h3 className="text-lg font-semibold text-gray-200 mb-5">Share this Regret</h3>
            <div className="flex flex-col gap-3">
              <button onClick={shareToWhatsApp} className="btn-share bg-green-600 hover:bg-green-700">
                <FaWhatsapp className="mr-3" /> WhatsApp
              </button>
              <button onClick={shareToInstagram} className="btn-share bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <FaInstagram className="mr-3" /> Instagram
              </button>
              <button onClick={shareToTwitter} className="btn-share bg-blue-500 hover:bg-blue-600">
                <FaTwitter className="mr-3" /> Twitter (X)
              </button>
              <button onClick={copyToClipboard} className="btn-share bg-gray-600 hover:bg-gray-700">
                <FaLink className="mr-3" /> Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePopup;
