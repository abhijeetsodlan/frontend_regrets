import React, { useState, useEffect } from "react";
import AddNewQuestion from "../components/AddnewQuestion";
import Login from "./Login";

const CheckAuthModal = ({ isOpen, onClose, onQuestionCreated }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");

    if (storedToken) {
      setToken(storedToken); // Update token state if it exists
    }
  }, [isOpen]); // Re-check when modal opens

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("auth_token", newToken); // Store token in localStorage
    setToken(newToken);
    onClose(); // Close modal after login
  };

  if (!isOpen) return null;

  return token ? (
    <AddNewQuestion isOpen={isOpen} onClose={onClose} onQuestionCreated={onQuestionCreated} />
  ) : (
    <Login isOpen={isOpen} onClose={onClose} onLoginSuccess={handleLoginSuccess} />
  );
};

export default CheckAuthModal;
