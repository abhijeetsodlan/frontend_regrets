  import React,{ useEffect } from "react";
  import { useNavigate } from "react-router-dom";

  const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
      const handleEsc = (event) => {
        if (event.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const user = params.get("user");

      if (token) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", user);
        navigate("/questions"); 
      }
    }, [navigate]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="bg-gray-900 text-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-6">Sign in with Google to continue</p>

          <a
            href="http://127.0.0.1:8000/auth/google"
            className="flex items-center justify-center w-full bg-white text-black py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition-all"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
              alt="Google Logo"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </a>  
        </div>
      </div>
    );
  };

  export default LoginModal;
