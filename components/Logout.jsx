import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        localStorage.removeItem("useremail");
        navigate("/login");
        if (onLogout) onLogout();
        return;
      }

      // Fetch CSRF token
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Logout request
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.removeItem("auth_token");
      localStorage.removeItem("useremail");
      navigate("/login");
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("useremail");
      navigate("/login");
      if (onLogout) onLogout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="block w-full text-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200"
    >
      Logout
    </button>
  );
};

export default Logout;