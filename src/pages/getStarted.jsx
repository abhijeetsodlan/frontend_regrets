import React from "react";
import { Link } from "react-router-dom";
import SeoMeta from "../../components/SeoMeta";

const regrets = [
  "Scaring off a woman who was as close to perfect as I'll ever get and was actually into me. Will probably die single now.",
  "I was very curious about an armpit fetish. I thought I'd enjoy it, but it was not as thrilling as I imagined. Now I can't forget the taste.",
  "On the first IPL match, I lost a huge amount in stakes. That money could have gone toward something meaningful. If you're thinking about betting, please don't."
];

const RegretCard = ({ text, className = "", compact = false }) => (
  <div className={`neon-border-card relative w-full max-w-[340px] rounded-2xl ${className}`}>
    <div
      className="pointer-events-none absolute -inset-[5px] rounded-2xl opacity-95 blur-[14px]"
      style={{
        background:
          "conic-gradient(from var(--line-angle), rgba(255,60,60,0) 0deg, rgba(255,60,60,0) 300deg, rgba(255,150,150,0.6) 316deg, rgba(255,90,90,1) 334deg, rgba(255,60,60,0) 350deg, rgba(255,60,60,0) 360deg)",
        animation: "borderLineMove var(--line-speed, 3.2s) linear infinite",
      }}
    />
    <div
      className="pointer-events-none absolute inset-0 rounded-2xl p-[2.25px]"
      style={{
        background:
          "conic-gradient(from var(--line-angle), rgba(255,50,50,0.35) 0deg, rgba(255,50,50,0.35) 298deg, rgba(255,185,185,1) 320deg, rgba(255,92,92,1) 338deg, rgba(255,50,50,0.35) 356deg, rgba(255,50,50,0.35) 360deg)",
        animation: "borderLineMove var(--line-speed, 3.2s) linear infinite",
      }}
    >
      <div className="h-full w-full rounded-2xl bg-[#06080f]" />
    </div>
    <article
      className={`relative z-10 rounded-2xl bg-slate-900/65 ${compact ? "p-3" : "p-4"} shadow-[0_20px_55px_rgba(0,0,0,0.42)] backdrop-blur-xl`}
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
  </div>
);

export default function GetStarted() {
  return (
    <>
      <SeoMeta
        title="Share Regrets Anonymously"
        description="Regrets.in is a safe anonymous space to share your regrets, read real stories, and feel less alone."
        path="/"
        keywords="regrets, anonymous confessions, share regrets, emotional support, real stories"
      />
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#05070d] via-[#060912] to-[#04050a] px-4 py-12 text-white sm:px-8 sm:py-20">
      <style>{`
        @property --line-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        .neon-border-card {
          --line-speed: 3.2s;
          transition: filter 220ms ease;
        }
        .neon-border-card:hover {
          --line-speed: 1.35s;
        }
        .cta-button {
          animation: ctaPulse 2.6s ease-in-out infinite;
        }
        .cta-button::after {
          content: "";
          position: absolute;
          inset: -1px auto -1px -40%;
          width: 38%;
          transform: skewX(-20deg);
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.42), rgba(255,255,255,0));
          filter: blur(0.4px);
          animation: ctaShine 3.3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 14px 35px rgba(251,113,133,0.26), 0 0 0 rgba(251,113,133,0); }
          50% { box-shadow: 0 18px 42px rgba(251,113,133,0.38), 0 0 18px rgba(251,113,133,0.28); }
        }
        @keyframes ctaShine {
          0%, 30% { left: -45%; opacity: 0; }
          40% { opacity: 0.9; }
          60% { left: 110%; opacity: 0; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes floatSlowA { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(-1deg)} }
        @keyframes floatSlowB { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(12px) rotate(1deg)} }
        @keyframes floatSlowC { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
        @keyframes floatMobileA { 0%,100%{transform:translateY(0) rotate(-1.2deg)} 50%{transform:translateY(-7px) rotate(-0.4deg)} }
        @keyframes floatMobileB { 0%,100%{transform:translateY(0) rotate(1.1deg)} 50%{transform:translateY(-8px) rotate(0.3deg)} }
        @keyframes glowPulse { 0%,100%{opacity:.28} 50%{opacity:.52} }
        @keyframes borderLineMove { to { --line-angle: 360deg; } }
        @keyframes regretGlow {
          0%, 100% { text-shadow: 0 0 0 rgba(251,113,133,0.0); filter: brightness(1); }
          50% { text-shadow: 0 0 18px rgba(251,113,133,0.35); filter: brightness(1.12); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-rose-400/16 blur-3xl"
          style={{ animation: "glowPulse 7s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
          style={{ animation: "glowPulse 9s ease-in-out infinite" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center sm:min-h-[560px] lg:min-h-[620px]">
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
            <div className="pointer-events-none relative mx-auto mb-6 h-[130px] w-full max-w-[330px] sm:hidden">
              <div
                className="absolute left-0 top-0 w-[47%] -rotate-[8deg] opacity-85"
                style={{ animation: "floatMobileA 6.6s ease-in-out infinite" }}
              >
                <RegretCard text={regrets[0]} compact />
              </div>
              <div
                className="absolute right-0 top-1 w-[47%] rotate-[8deg] opacity-85"
                style={{ animation: "floatMobileB 7.1s ease-in-out infinite" }}
              >
                <RegretCard text={regrets[1]} compact />
              </div>
            </div>
          
            <h1 className="text-3xl font-black leading-[1.02] tracking-tight sm:text-4xl md:text-5xl">
              <span className="block">
                Every{" "}
                <span
                  className="bg-gradient-to-r from-rose-300 via-rose-200 to-rose-400 bg-clip-text text-transparent"
                  style={{ animation: "regretGlow 2.2s ease-in-out infinite" }}
                >
                  regret
                </span>{" "}
                has a story.
              </span>
              <span className="mt-2 block text-rose-400">Every story deserves a voice.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-7 sm:text-xl">
              A safe, anonymous space to share regrets. Discover what others hold inside and feel a little less alone.
            </p>
            <Link
              to="/regrets"
              className="cta-button relative mt-8 inline-flex h-12 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-7 text-base font-semibold text-white shadow-[0_14px_35px_rgba(251,113,133,0.3)] transition hover:-translate-y-0.5 hover:from-rose-600 hover:to-rose-500 sm:mt-9 sm:w-auto sm:max-w-none sm:px-9 sm:text-lg"
            >
              <span className="relative z-10">Dive In Now</span>
            </Link>

            <div className="pointer-events-none relative mx-auto mt-5 h-[132px] w-full max-w-[170px] sm:hidden">
              <div
                className="absolute left-1/2 top-0 w-full -translate-x-1/2 -rotate-[4deg] opacity-90"
                style={{ animation: "floatMobileA 6.2s ease-in-out infinite" }}
              >
                <RegretCard text={regrets[2]} compact />
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
    </>
  );
}
