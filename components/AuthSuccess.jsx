import React,{ useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const name = queryParams.get("name");
    const email = queryParams.get("email");

    if (token) {
      // Store the token in localStorage (or Context API for global state)
      localStorage.setItem("auth_token", token);
      localStorage.setItem("useremail", email);

      // Redirect to another page after successful login (optional)
      navigate("/regrets"); 
    }
  }, [location, navigate]);

  return <div>Logging in...</div>;
};

export default AuthSuccess;
