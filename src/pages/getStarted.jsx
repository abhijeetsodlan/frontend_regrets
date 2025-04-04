import React from "react";
import { Link } from "react-router-dom";

export default function GetStarted() {
  // Array of regrets to display in floating boxes
  const regrets = [
    {
      text: "being a girl in this generation is the my biggest regression... 😓😓",
    },
    {
      text: "On the very first match of IPL, I lost a huge amount of money in stakes. That money could have been used for something much better—something meaningful for me. If you’re thinking about betting, please don’t. It’s not worth it.",
    },
    {
      text: "I was very curious about armpit fetish. I thought I’d enjoy it, but licking an armpit wasn’t as thrilling as I imagined. Now I can’t forget the taste. 😅",
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Main Content */}
      <div className="text-center px-4 sm:px-8 max-w-3xl z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4 tracking-tight flex flex-col sm:flex-row sm:space-x-2 justify-center">
          <span>Write it.</span>
          <span>Read it.</span>
          <span>Feel it.</span>
        </h1>
        <p className="mt-6 text-gray-300 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto">
          Share your regrets—anonymously or openly. See what others regret, respond, and connect.
        </p>
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Link to="/regrets">
            <button className="px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-medium bg-red-500 hover:bg-red-600 rounded-full shadow-xl transition-all duration-300 ease-in-out hover:shadow-red-500/20">
              Dive In Now
            </button>
          </Link>
        </div>
      </div>

      {/* Floating Boxes for Regrets */}
      {/* On larger screens, position boxes on all sides; on mobile, stack them vertically */}
      <div className="absolute inset-0 z-0 flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-6 sm:gap-0">
        {regrets.map((regret, index) => (
          <div
            key={index}
            className={`
              bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out 
              w-11/12 sm:w-64 md:w-80 transform hover:-translate-y-1 
              sm:absolute 
              ${index === 0 ? "sm:top-10 sm:left-10 sm:-rotate-6" : ""}
              ${index === 1 ? "sm:bottom-10 sm:right-10 sm:rotate-6" : ""}
              ${index === 2 ? "sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rotate-3" : ""}
              ${index === 0 ? "top-10" : index === 1 ? "bottom-10" : "top-1/2 -translate-y-1/2"}
            `}
          >
            <p className="text-gray-200 text-sm sm:text-base font-light">
              {regret.text}
            </p>
          </div>
        ))}
      </div>

      {/* Subtle background effect */}
      <div className="absolute inset-0 z-0">
        <div className="w-64 h-64 bg-red-500/10 rounded-full absolute -top-32 -left-32 blur-3xl"></div>
        <div className="w-64 h-64 bg-red-500/10 rounded-full absolute -bottom-32 -right-32 blur-3xl"></div>
      </div>
    </div>
  );
}