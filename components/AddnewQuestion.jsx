import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateQuestionModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]); // ✅ Initialized as empty array
  const [categoriesLoading, setCategoriesLoading] = useState(true); // ✅ Loading state for categories

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories");
        setCategories(response.data.data); // Adjust based on API response structure
      } catch (err) {
        console.error("Error fetching categories:", err);
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
        category_id: parseInt(categoryId, 10),
      };

      if (isAnonymous) {
        requestData.is_anonymous = 1;
      }

      console.log("Request Data:", requestData);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/question",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Question Created:", response.data);
      onClose();
    } catch (err) {
      console.error("Error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">Submit a new Regret</h2>
        
        {/* Show loading message if categories are still loading */}
        {categoriesLoading ? (
          <p className="text-green-500">Loading categories...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question Title Input */}
            <input
              type="text"
              placeholder="Your Regret here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Category Dropdown */}
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Post Anonymously Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="anonymous" className="text-sm">Submit Anonymously</label>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-bold transition duration-300"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
