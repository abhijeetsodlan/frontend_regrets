import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutRequest, requestCsrfCookie } from "../src/services/authService";

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

      await requestCsrfCookie();
      await logoutRequest({ token });

      localStorage.removeItem("auth_token");
      localStorage.removeItem("useremail");
      navigate("/login");
      if (onLogout) onLogout();
    } catch {
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
