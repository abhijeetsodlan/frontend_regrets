import React from "react";
import { Link } from "react-router-dom";

export default function GetStarted() {
  const regrets = [
    {
      text: "Scaring off a woman who was as close to perfect as I’ll ever get and was actually into me. Will probably die single now.",
    },
    {
      text: "I was very curious about armpit fetish. I thought I’d enjoy it, but licking an armpit wasn’t as thrilling as I imagined. Now I can’t forget the taste. 😅",
    },
    {
      text: "On the very first match of IPL, I lost a huge amount of money in stakes. That money could have been used for something much better—something meaningful for me. If you’re thinking about betting, please don’t. It’s not worth it.",
    },
  ];

  const RegretCard = ({ text, style }) => (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 text-sm sm:text-base text-gray-100 p-4 rounded-xl shadow-lg w-72 transform transition hover:-translate-y-1 hover:shadow-2xl ${style}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-300">
          A
        </div>
        <span className="text-gray-300 text-sm font-medium">Anonymous</span>
      </div>
      <p className="text-gray-200 leading-relaxed">{text}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden py-12 sm:py-20 px-4">
      
      {/* Background Blurs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-96 h-96 bg-red-500/20 rounded-full absolute -top-32 -left-32 blur-3xl"></div>
        <div className="w-96 h-96 bg-red-500/20 rounded-full absolute -bottom-32 -right-32 blur-3xl"></div>
      </div>

      {/* Floating Regrets */}
      <div className="absolute z-10 hidden sm:flex sm:gap-8 sm:top-20 sm:left-10">
        <RegretCard text={regrets[0].text} style="rotate-[-3deg]" />
      </div>

      <div className="absolute z-10 hidden sm:flex sm:gap-8 sm:bottom-20 sm:left-10">
        <RegretCard text={regrets[1].text} style="rotate-[2deg]" />
      </div>

      <div className="absolute z-10 hidden sm:flex sm:gap-8 sm:bottom-20 sm:right-10">
        <RegretCard text={regrets[2].text} style="rotate-[-2deg]" />
      </div>

      {/* Main Section */}
      <div className="z-20 text-center max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="block">Write it.</span>
          <span className="block text-red-500">Read it.</span>
          <span className="block">Feel it.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 font-light">
          A safe, anonymous space to share regrets. Discover what others hold inside—and maybe, feel a little less alone.
        </p>
        <Link to="/regrets">
          <button className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 text-white text-lg rounded-full shadow-md transition duration-300 ease-in-out hover:shadow-red-600/30">
            Dive In Now
          </button>
        </Link>
      </div>

      {/* Mobile-only regrets under main */}
      <div className="sm:hidden mt-10 space-y-4 z-10">
        {regrets.map((r, i) => (
          <RegretCard key={i} text={r.text} />
        ))}
      </div>
    </div>
  );
}
