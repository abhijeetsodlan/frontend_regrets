import React from "react";
import { Link } from "react-router-dom";

const ABHIJEET_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_rinx1KYGFy18wkY9gJ5B8GBjg5rv8WaBNg&s"; 

const Footer = () => {

  return (
    <footer className="w-full bg-gray-100 text-gray-700 py-12 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand Section (Top-Left) */}
        <div className="text-left mb-8">
          <h2 className="text-4xl font-extrabold text-red-600">Regrets.in</h2>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600 max-w-md">
              Share your regrets, read others' stories, and see who
              relates—anonymously or openly.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/support"
                  className="hover:text-red-600 transition-all duration-200"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-red-600 transition-all duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-red-600 transition-all duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-gray-300 pt-6">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} Regrets.in - All rights reserved.
          </p>
          <a
            href="https://abhijeet.online"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center mt-4 sm:mt-0 cursor-pointer hover:opacity-80 transition-all duration-200"
          >
            <img
              src={ABHIJEET_IMAGE_URL}
              alt="Abhijeet Sodlan"
              className="w-10 h-10 rounded-full border-2 border-red-600 object-cover"
            />
            <p className="text-xs ml-3 text-gray-600">
              Made by{" "}
              <span className="font-semibold text-gray-800">
                Abhijeet Sodlan
              </span>
            </p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
