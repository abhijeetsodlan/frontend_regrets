import React from "react";
import { Link } from "react-router-dom";

const ABHIJEET_IMAGE_URL =
  "https://pbs.twimg.com/profile_images/1917982995052691456/SmbTOeLq_400x400.jpg";

const Footer = () => {
  return (
    <footer className="w-full backdrop-blur-xl bg-white/80 text-gray-800 py-12 border-t border-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div>
            <h2 className="text-3xl font-extrabold text-rose-500 mb-4">
              Regrets.in
            </h2>
            <p className="text-sm text-gray-600 max-w-xs">
              Share your regrets. Read real stories. Connect with others - anonymously or openly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/regrets"
                  className="hover:text-rose-500 transition duration-200"
                >
                  Explore Regrets
                </Link>
              </li>
              <li>
                <a
                  href="mailto:abhijeetsodlan7@gmail.com"
                  className="hover:text-rose-500 transition duration-200"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-md font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-rose-500 transition duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Info */}
          <div>
            <a
              href="https://abhijeethere.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-90 transition duration-200"
            >
              <img
                src={ABHIJEET_IMAGE_URL}
                alt="Abhijeet Sodlan"
                className="w-10 h-10 rounded-full border-2 border-rose-400 object-cover shadow-sm"
              />
              <p className="ml-3 text-sm text-gray-700">
                Made by{" "}
                <span className="font-semibold text-gray-900">
                  Abhijeet Sodlan
                </span>
              </p>
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} 
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
