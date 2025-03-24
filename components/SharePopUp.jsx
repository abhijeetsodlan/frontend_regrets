import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaTwitter, FaLink, FaTimes, FaShareAlt } from "react-icons/fa";

const SharePopup = ({ regretId, regretTitle }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Base URL for sharing (adjust to your app's domain)
  const shareUrl = `http://localhost:5173/regrets/${regretId}`;
  const shareText = `Check out this regret: "${regretTitle}" on Regrets.in`;

  // Toggle popup visibility and stop propagation
  const togglePopup = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent
    setIsOpen(!isOpen);
  };

  // Copy link to clipboard
  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!");
      setIsOpen(false);
    });
  };

  // Share via Web Share API (if supported)
  const shareViaNavigator = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: regretTitle,
          text: shareText,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      togglePopup(e); // Fallback to popup if Web Share API is not supported
    }
  };

  // Specific platform share links
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

  // Close popup when clicking outside
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
      {/* Share Button */}
      <button
        onClick={navigator.share ? shareViaNavigator : togglePopup}
        className="flex items-center border px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition hover:bg-gray-800 text-white"
      >
        <FaShareAlt size={16} className="mr-1" />
        
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Popup Content */}
          <div className="share-popup relative bg-gray-800 rounded-xl p-6 w-80 max-w-sm shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
            >
              <FaTimes size={18} />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4">Share this Regret</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={shareToWhatsApp}
                className="flex items-center justify-start w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
              >
                <FaWhatsapp size={20} className="mr-3" />
                WhatsApp
              </button>
              <button
                onClick={shareToInstagram}
                className="flex items-center justify-start w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              >
                <FaInstagram size={20} className="mr-3" />
                Instagram
              </button>
              <button
                onClick={shareToTwitter}
                className="flex items-center justify-start w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
              >
                <FaTwitter size={20} className="mr-3" />
                Twitter (X)
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-start w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                <FaLink size={20} className="mr-3" />
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