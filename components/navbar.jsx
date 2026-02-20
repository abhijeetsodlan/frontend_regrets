import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "./Login";
import Logout from "./Logout"; // Import the Logout component

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Callback to handle logout success
  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-black/40 backdrop-blur-md text-white py-4 shadow-lg sticky top-0 z-50 border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Website Name */}
        <Link
          to="/"
          className="text-2xl font-bold text-rose-500 hover:text-rose-400 transition-all duration-300"
        >
          Regrets.in
        </Link>

        {/* Right Side: User Icon or Login Button */}
        <div className="relative" ref={menuRef}>
          {isLoggedIn ? (
            <div className="relative">
              <FaUserCircle
                className="text-3xl cursor-pointer hover:text-rose-400 transition-all duration-300"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-black/70 backdrop-blur-md rounded-xl shadow-2xl p-3 transition-all duration-300 transform origin-top scale-100 opacity-100 border border-gray-700">
                  <Link
                    to="/myProfile"
                    className="block w-full text-center px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Logout onLogout={handleLogoutSuccess} />
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-rose-500 px-6 py-2 rounded-full font-medium text-white hover:bg-rose-600 shadow-lg transition-all duration-300 hover:shadow-rose-500/20"
              onClick={() => setLoginModalOpen(true)}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
