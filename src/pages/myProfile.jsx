import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

        const response = await fetch(
          "https://stagingcrm.goldensupplementstore.com/api/myprofile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ email: userEmail }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUser({
          name: data.data.name || "",
          email: data.data.email || "",
        });
        setUploadedPosts(data.data.uploaded_posts || []);
        setSavedPosts(data.data.saved_posts || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const nameInitial = user.name.charAt(0).toUpperCase();
  const handleRegretClick = (postId) => navigate(`/regrets/${postId}`);
  const handleBackClick = () => navigate(-1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8 flex flex-col items-center">
      {/* Profile Card */}
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-700 text-red-400 flex items-center justify-center text-2xl font-bold border-4 border-red-500 shadow-inner">
            {nameInitial}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-400">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300 transition"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-2xl mt-8">
        <div className="flex border-b border-gray-700">
          {["uploaded", "saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center font-medium transition-all ${
                activeTab === tab
                  ? "text-red-400 border-b-2 border-red-400"
                  : "text-gray-400 hover:text-red-400"
              }`}
            >
              {tab === "uploaded" ? "Your Regrets" : "Saved Regrets"}
            </button>
          ))}
        </div>

        {/* Regret Posts */}
        <div className="mt-6 space-y-4">
          {(activeTab === "uploaded" ? uploadedPosts : savedPosts).length > 0 ? (
            (activeTab === "uploaded" ? uploadedPosts : savedPosts).map((post) => (
              <div
                key={post.id}
                onClick={() => handleRegretClick(post.id)}
                className="bg-gray-800 hover:bg-gray-700 transition-all p-4 rounded-lg shadow flex justify-between items-center cursor-pointer group"
              >
                <p className="text-sm text-gray-300">{post.title}</p>
                <span className="text-xl font-bold text-gray-500 group-hover:text-white transition">
                  →
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">
              {activeTab === "uploaded"
                ? "No uploaded posts yet."
                : "No saved posts yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
