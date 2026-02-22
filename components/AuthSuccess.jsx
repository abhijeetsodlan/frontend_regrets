import React,{ useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeoMeta from "./SeoMeta";

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    if (token) {
      // Store the token in localStorage (or Context API for global state)
      localStorage.setItem("auth_token", token);
      localStorage.setItem("useremail", email);

      // Redirect to another page after successful login (optional)
      navigate("/regrets"); 
    }
  }, [location, navigate]);

  return (
    <>
      <SeoMeta
        title="Authorizing Login"
        description="Completing secure sign in on Regrets.in."
        path="/questions/auth-success"
        noIndex
      />
      <div>Logging in...</div>
    </>
  );
};

export default AuthSuccess;
