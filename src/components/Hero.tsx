"use client"
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const QUESTION = "Walk me through a time you optimized a slow API.";
const ANSWER = "Sure — we had a reporting endpoint that took 4s...";

const FEATURES = [
  {
    label: "Voice",
    title: "Real conversations",
    body: "Powered by VAPI, so questions and follow-ups happen out loud, not typed.",
  },
  {
    label: "Questions",
    title: "Built for the role",
    body: "Grok AI writes technical and HR questions from the job you're prepping for.",
  },
  {
    label: "Storage",
    title: "Every session saved",
    body: "Transcripts and scores land in Postgres, so you can track progress over time.",
  },
];

const Hero = () => {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  // Typed-out answer line — the panel's job is to *show* a live interview,
  // so the answer should arrive the way speech-to-text would render it,
  // not just appear fully formed.
  const [typedAnswer, setTypedAnswer] = useState("");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setTypedAnswer(ANSWER);
      return;
    }

    let i = 0;
    // wait for the panel's own fade-up (200ms delay + 600ms duration) to
    // finish before the "speaking" starts, so the two moments don't compete
    const startDelay = setTimeout(() => {
      const typer = setInterval(() => {
        i += 1;
        setTypedAnswer(ANSWER.slice(0, i));
        if (i >= ANSWER.length) clearInterval(typer);
      }, 28);
      return () => clearInterval(typer);
    }, 900);

    return () => clearTimeout(startDelay);
  }, []);

  // Scroll-triggered reveal for the feature strip, staggered per item
  const featureStripRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    const el = featureStripRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setFeaturesVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FAF8F4] pt-24 pb-20 px-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');

        .hero-display { font-family: 'Space Grotesk', sans-serif; }
        .hero-body { font-family: 'IBM Plex Sans', sans-serif; }
        .hero-mono { font-family: 'IBM Plex Mono', monospace; }

        @keyframes waveform {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes blink-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-16px, 12px); }
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0) rotate(var(--tilt, 0deg)); }
          50% { transform: translateY(-9px) rotate(var(--tilt, 0deg)); }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.6) rotate(var(--tilt, 0deg)); }
          to { opacity: 1; transform: scale(1) rotate(var(--tilt, 0deg)); }
        }
        .fade-up { animation: fade-up 0.6s ease-out both; }
        .wave-bar { animation: waveform 1.1s ease-in-out infinite; transform-origin: center; }
        .cursor-blink { animation: blink-cursor 1s step-end infinite; }
        .ambient-glow { animation: drift 9s ease-in-out infinite; }
        .float-badge {
          animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both,
                     float-badge 4.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .wave-bar, .cursor-blink, .fade-up, .ambient-glow, .animate-ping, .float-badge {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* ambient background glow — quiet depth behind the panel, not a spotlight */}
      <div
        className="ambient-glow absolute -top-24 right-[6%] w-[420px] h-[420px] rounded-full bg-[#3E63DD]/[0.07] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="ambient-glow absolute top-40 right-[18%] w-[280px] h-[280px] rounded-full bg-[#35D0BA]/[0.08] blur-3xl pointer-events-none"
        style={{ animationDelay: "-4s" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center max-w-6xl mx-auto">

          {/* Left: copy */}
          <div>
            <div className="hero-mono text-xs tracking-[0.18em] uppercase text-[#3E63DD] mb-6 fade-up">
              AI mock interviews
            </div>

            <h1 className="hero-display text-5xl md:text-6xl font-bold text-[#12151B] mb-6 leading-[1.05] fade-up" style={{ animationDelay: "80ms" }}>
              Practice out loud.
              <br />
              Walk in ready.
            </h1>

            <p className="hero-body text-lg text-[#4B5160] mb-10 max-w-md leading-relaxed fade-up" style={{ animationDelay: "160ms" }}>
              A voice-driven interview partner that asks real questions for the
              role you&apos;re going for, and tells you exactly where you lost the room.
            </p>

            <div className="flex items-center gap-6 mb-12 fade-up" style={{ animationDelay: "240ms" }}>
              <Button
                onClick={() => router.push(isLoggedIn ? "/dashboard" : "/auth")}
                size="lg"
                className="bg-[#12151B] hover:bg-[#1E222B] text-white px-7 py-6 text-base font-semibold rounded-lg shadow-none group transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(18,21,27,0.45)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoggedIn ? "Go to Dashboard" : "Start a mock interview"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="hero-mono text-xs text-[#8A8F9C] tracking-wide fade-up" style={{ animationDelay: "300ms" }}>
              Live voice · Adaptive questions · Instant feedback
            </div>
          </div>

          {/* Right: signature element — live transcript panel */}
          <div className="fade-up" style={{ animationDelay: "200ms" }}>
            <div className="bg-[#12151B] rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(18,21,27,0.3)]">
              {/* header row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35D0BA] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35D0BA]" />
                  </span>
                  <span className="hero-mono text-xs text-[#35D0BA] tracking-wide">LIVE · 00:42</span>
                </div>
                <div className="flex items-end gap-[3px] h-5">
                  {[0.4, 0.7, 1, 0.5, 0.8, 0.3, 0.6].map((d, i) => (
                    <span
                      key={i}
                      className="wave-bar w-[3px] bg-[#35D0BA] rounded-full"
                      style={{ height: "100%", animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                </div>
              </div>

              {/* transcript */}
              <div className="space-y-4">
                <div>
                  <div className="hero-mono text-[11px] uppercase tracking-wide text-[#6B7280] mb-1">
                    Interviewer
                  </div>
                  <div className="hero-body text-[15px] text-[#E7E5E1] leading-relaxed">
                    {QUESTION}
                  </div>
                </div>

                <div>
                  <div className="hero-mono text-[11px] uppercase tracking-wide text-[#6B7280] mb-1">
                    You
                  </div>
                  <div className="hero-body text-[15px] text-[#E7E5E1] leading-relaxed min-h-[1.5em]">
                    {typedAnswer}
                    <span className="cursor-blink inline-block w-[7px] h-[15px] bg-[#35D0BA] ml-1 align-middle" />
                  </div>
                </div>
              </div>

              <div className="hero-mono text-[11px] text-[#4B5160] mt-6 pt-4 border-t border-white/10">
                Question 3 of 8 · Backend systems
              </div>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div
          ref={featureStripRef}
          className="max-w-6xl mx-auto mt-24 pt-10 border-t border-[#12151B]/10"
        >
          <div className="grid md:grid-cols-3 gap-10 md:gap-0">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className={`${i > 0 ? "md:pl-8 md:border-l md:border-[#12151B]/10" : ""} ${
                  featuresVisible ? "fade-up" : "opacity-0"
                }`}
                style={featuresVisible ? { animationDelay: `${i * 120}ms` } : undefined}
              >
                <div className="hero-mono text-[11px] tracking-[0.18em] uppercase text-[#3E63DD] mb-3">
                  {f.label}
                </div>
                <h3 className="hero-display text-lg font-semibold text-[#12151B] mb-2">
                  {f.title}
                </h3>
                <p className="hero-body text-sm text-[#6B7280] leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;