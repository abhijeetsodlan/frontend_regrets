import React from "react";
import { Link } from "react-router-dom";

const ABHIJEET_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_rinx1KYGFy18wkY9gJ5B8GBjg5rv8WaBNg&s";

const Footer = () => {
  return (
    <footer className="w-full backdrop-blur-xl bg-white/80 text-gray-800 py-12 border-t border-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div>
            <h2 className="text-3xl font-extrabold text-red-500 mb-4">
              Regrets.in
            </h2>
            <p className="text-sm text-gray-600 max-w-xs">
              Share your regrets, read others’ stories, and connect—anonymously
              or openly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/regrets"
                  className="hover:text-red-500 transition duration-200"
                >
                  Explore Regrets
                </Link>
              </li>
              <li>
                <a
                  href="mailto:abhijeetsodlan7@gmail.com"
                  className="hover:text-red-500 transition duration-200"
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
                  className="hover:text-red-500 transition duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Info */}
          <div>
            <a
              href="https://abhijeet.online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-90 transition duration-200"
            >
              <img
                src={ABHIJEET_IMAGE_URL}
                alt="Abhijeet Sodlan"
                className="w-10 h-10 rounded-full border-2 border-red-400 object-cover shadow-sm"
              />
              <p className="ml-3 text-sm text-gray-700">
                Made by{" "}
                <span className="font-semibold text-gray-900">
                  Abhijeet Sodlan
                </span>
              </p>
            </a>
          </div>
          <div className="flex items-start mt-4">
            <img
              src="https://pbs.twimg.com/profile_images/1914539916601577472/sufuUWSe_400x400.jpg"
              alt="Piyush Kumar"
              className="w-10 h-10 rounded-full border-2 border-red-400 object-cover shadow-sm"
            />
            <div className="ml-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">
                  Piyush Kumar
                </span>
              </p>
              <ul className="text-xs text-gray-500 list-disc list-inside leading-snug mt-1">
                <li>SEO Manager</li>
                <li>Chief Strategy Officer</li>
                <li>Head of Product & Growth</li>
                <li>Marketing Director</li>
                <li>Behavioral Data Analyst</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Regrets.in — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
