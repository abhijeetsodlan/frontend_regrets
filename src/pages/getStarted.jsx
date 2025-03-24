import React from "react";
import { Link } from "react-router-dom";

export default function GetStarted() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <div className="text-center px-8 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mt-4 tracking-tight">
        Unspoken Thoughts, Shared Stories
        </h1>
        <p className="mt-6 text-gray-300 text-xl md:text-2xl font-light max-w-2xl mx-auto">
        Share your regrets, read others’ stories, and see who relates – anonymously or openly.
        </p>
        <div className="mt-10 flex justify-center">
          <Link to="/regrets">
            <button className="px-10 py-4 text-xl font-medium bg-red-500 hover:bg-red-600 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:shadow-red-500/20">
              Dive In Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}