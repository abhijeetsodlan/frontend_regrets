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

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userEmail = localStorage.getItem("useremail");
        const authToken = localStorage.getItem("auth_token");

        if (!userEmail || !authToken) {
          throw new Error("User not authenticated");
        }

        const response = await fetch("http://127.0.0.1:8000/api/myprofile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ email: userEmail }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        console.log("response is here:", data);

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

  // Handle redirection to regret details
  const handleRegretClick = (postId) => {
    navigate(`/regrets/${postId}`);
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate(-1); // Go back one step in history
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6 flex items-center justify-center">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6 flex flex-col items-center">
      {/* Profile Section */}
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full border-4 border-red-400 bg-gray-700 text-red-400 text-2xl font-bold">
            {nameInitial}
          </div>
          <div className="text-left">
            <h2 className="text-xl font-semibold text-red-400">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleBackClick}
          className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-2xl mt-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 text-center py-2 font-medium transition-all ${
              activeTab === "uploaded" ? "border-b-2 border-red-400 text-red-400" : "text-gray-400 hover:text-red-400"
            }`}
            onClick={() => setActiveTab("uploaded")}
          >
            Your Regrets
          </button>
          <button
            className={`flex-1 text-center py-2 font-medium transition-all ${
              activeTab === "saved" ? "border-b-2 border-red-400 text-red-400" : "text-gray-400 hover:text-red-400"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Regrets
          </button>
        </div>

        {/* Uploaded Posts */}
        {activeTab === "uploaded" && (
          <div className="mt-4 space-y-4">
            {uploadedPosts.length > 0 ? (
              uploadedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleRegretClick(post.id)}
                >
                  <p className="text-gray-300 text-sm">{post.title}</p>
                  <span className="text-white font-extrabold text-xl">→</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No uploaded posts yet.</p>
            )}
          </div>
        )}

        {/* Saved Posts */}
        {activeTab === "saved" && (
          <div className="mt-4 space-y-4">
            {savedPosts.length > 0 ? (
              savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleRegretClick(post.id)}
                >
                  <p className="text-gray-300 text-sm">{post.title}</p>
                  <span className="text-white font-extrabold text-xl">→</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No saved posts yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;