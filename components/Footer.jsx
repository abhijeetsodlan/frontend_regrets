import React from "react";
import { Link } from "react-router-dom";

const ABHIJEET_IMAGE_URL =
  "https://pbs.twimg.com/profile_images/1917982995052691456/SmbTOeLq_400x400.jpg";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300 bg-white/80 py-12 text-gray-800 shadow-md backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h2 className="mb-4 text-3xl font-extrabold text-rose-500">Regrets.in</h2>
            <p className="max-w-xs text-sm text-gray-600">
              Share your regrets. Read real stories. Connect with others - anonymously or openly.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-md font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/regrets" className="transition duration-200 hover:text-rose-500">
                  Explore Regrets
                </Link>
              </li>
              <li>
                <a href="mailto:abhijeetsodlan7@gmail.com" className="transition duration-200 hover:text-rose-500">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-md font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="transition duration-200 hover:text-rose-500">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <a
              href="https://abhijeethere.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center transition duration-200 hover:opacity-90"
            >
              <img
                src={ABHIJEET_IMAGE_URL}
                alt="Abhijeet Sodlan"
                className="h-10 w-10 rounded-full border-2 border-rose-400 object-cover shadow-sm"
              />
              <p className="ml-3 text-sm text-gray-700">
                {"\u0905\u092d\u093f\u091c\u0940\u0924 \u0938\u094b\u0921\u0932\u093e\u0928 \u0926\u094d\u0935\u093e\u0930\u093e \u0928\u093f\u0930\u094d\u092e\u093f\u0924 \u090f\u0935\u0902 \u0935\u093f\u0915\u0938\u093f\u0924"}
              </p>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
