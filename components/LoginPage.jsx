import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa"; // Using react-icons for a cleaner Google icon

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_name", name);
      localStorage.setItem("useremail", email);
      navigate("/regrets");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 transform transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <p className="text-gray-400 text-center mb-6">
          Please login to continue !
        </p>

        {/* Google Login Button */}
        <a
          href="http://localhost:3000/auth/google"
          className="flex items-center justify-center w-full bg-white text-gray-900 py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
        >
          <FaGoogle className="text-xl mr-3 " />
          <span className="font-medium">Continue with Google</span>
        </a>

        {/* Optional Divider and Info */}
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-800 px-2 text-gray-500">
                Secure & Fast
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
