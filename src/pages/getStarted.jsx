import React from "react";
import { Link } from "react-router-dom";

const regrets = [
  "Scaring off a woman who was as close to perfect as I'll ever get and was actually into me. Will probably die single now.",
  "I was very curious about an armpit fetish. I thought I'd enjoy it, but it was not as thrilling as I imagined. Now I can't forget the taste.",
  "On the first IPL match, I lost a huge amount in stakes. That money could have gone toward something meaningful. If you're thinking about betting, please don't."
];

const RegretCard = ({ text, className = "", compact = false }) => (
  <article
    className={`w-full max-w-[340px] rounded-2xl border border-white/10 bg-slate-900/65 ${compact ? "p-3" : "p-4"} shadow-[0_20px_55px_rgba(0,0,0,0.42)] backdrop-blur-xl ${className}`}
  >
    <div className={`flex items-center gap-2 ${compact ? "mb-2" : "mb-3"}`}>
      <div className={`flex items-center justify-center rounded-full bg-slate-600 text-xs font-semibold text-slate-200 ${compact ? "h-7 w-7" : "h-8 w-8"}`}>
        A
      </div>
      <p className={`${compact ? "text-xs" : "text-sm"} font-semibold text-slate-300`}>Anonymous</p>
    </div>
    <p
      className={`${compact ? "text-xs leading-5" : "text-sm leading-7"} text-slate-200`}
      style={
        compact
          ? {
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }
          : undefined
      }
    >
      {text}
    </p>
  </article>
);

export default function GetStarted() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#05070d] via-[#060912] to-[#04050a] px-4 py-12 text-white sm:px-8 sm:py-20">
      <style>{`
        @keyframes floatSlowA { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(-1deg)} }
        @keyframes floatSlowB { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(12px) rotate(1deg)} }
        @keyframes floatSlowC { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
        @keyframes floatMobileA { 0%,100%{transform:translateY(0) rotate(-1.2deg)} 50%{transform:translateY(-7px) rotate(-0.4deg)} }
        @keyframes floatMobileB { 0%,100%{transform:translateY(0) rotate(1.1deg)} 50%{transform:translateY(-8px) rotate(0.3deg)} }
        @keyframes glowPulse { 0%,100%{opacity:.28} 50%{opacity:.52} }
        @keyframes regretGlow {
          0%, 100% { text-shadow: 0 0 0 rgba(239,68,68,0.0); filter: brightness(1); }
          50% { text-shadow: 0 0 22px rgba(239,68,68,0.55); filter: brightness(1.15); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-red-500/20 blur-3xl"
          style={{ animation: "glowPulse 7s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
          style={{ animation: "glowPulse 9s ease-in-out infinite" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center sm:min-h-[560px] lg:min-h-[620px]">
          <div className="pointer-events-none absolute inset-x-0 top-1 z-10 sm:hidden">
            <div
              className="absolute left-0 w-[45%] max-w-[170px] -rotate-[8deg] opacity-85"
              style={{ animation: "floatMobileA 6.6s ease-in-out infinite" }}
            >
              <RegretCard text={regrets[0]} compact />
            </div>
            <div
              className="absolute right-0 w-[45%] max-w-[170px] rotate-[8deg] opacity-85"
              style={{ animation: "floatMobileB 7.1s ease-in-out infinite" }}
            >
              <RegretCard text={regrets[1]} compact />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="absolute left-0 top-0 z-10" style={{ animation: "floatSlowA 8s ease-in-out infinite" }}>
              <RegretCard text={regrets[0]} />
            </div>
            <div className="absolute right-0 top-0 z-10" style={{ animation: "floatSlowB 9s ease-in-out infinite" }}>
              <RegretCard text={regrets[1]} />
            </div>
            <div className="absolute left-0 bottom-0 z-10" style={{ animation: "floatSlowC 8.5s ease-in-out infinite" }}>
              <RegretCard text={regrets[2]} />
            </div>
          </div>

          <div className="z-10 w-full max-w-3xl text-center">
          
            <h1 className="text-3xl font-black leading-[1.02] tracking-tight sm:text-4xl md:text-5xl">
              <span className="block">
                Every{" "}
                <span
                  className="bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent"
                  style={{ animation: "regretGlow 2.2s ease-in-out infinite" }}
                >
                  regret
                </span>{" "}
                has a story.
              </span>
              <span className="mt-2 block text-red-500">Every story deserves a voice.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-7 sm:text-xl">
              A safe, anonymous space to share regrets. Discover what others hold inside and feel a little less alone.
            </p>
            <Link
              to="/regrets"
              className="mt-8 inline-flex h-12 w-full max-w-[220px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-400 px-7 text-base font-semibold text-white shadow-[0_14px_35px_rgba(239,68,68,0.35)] transition hover:-translate-y-0.5 hover:from-red-600 hover:to-red-500 sm:mt-9 sm:w-auto sm:max-w-none sm:px-9 sm:text-lg"
            >
              Dive In Now
            </Link>

            <div className="pointer-events-none relative mx-auto mt-4 h-[140px] w-full max-w-[320px] sm:hidden">
              <div
                className="absolute left-0 top-0 w-[46%] -rotate-[7deg] opacity-90"
                style={{ animation: "floatMobileA 6.2s ease-in-out infinite" }}
              >
                <RegretCard text={regrets[2]} compact />
              </div>
              <div
                className="absolute right-0 top-1 w-[46%] rotate-[7deg] opacity-90"
                style={{ animation: "floatMobileB 6.9s ease-in-out infinite" }}
              >
                <RegretCard text={regrets[1]} compact />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 hidden sm:block lg:hidden">
          <div className="mx-auto max-w-2xl justify-items-center gap-3 sm:grid sm:grid-cols-2">
            <RegretCard text={regrets[0]} className="sm:rotate-[-1deg]" />
            <RegretCard text={regrets[1]} className="sm:rotate-[1deg]" />
            <div className="sm:col-span-2 sm:flex sm:justify-center">
              <RegretCard text={regrets[2]} className="sm:rotate-[-1deg]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
