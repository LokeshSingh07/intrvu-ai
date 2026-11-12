'use client'
import { Brain, Clock, Shield, Target, Users, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-powered analysis",
      description: "Natural language processing evaluates responses for technical skill, communication, and fit."
    },
    {
      icon: Clock,
      title: "Real-time feedback",
      description: "Get instant insight and recommendations during the interview, not days after."
    },
    {
      icon: Shield,
      title: "Bias-free assessment",
      description: "Objective, data-driven scoring criteria replace unconscious bias with a standardized rubric."
    },
    {
      icon: Target,
      title: "Custom skill testing",
      description: "Tailor interviews to a role with custom question sets and competency frameworks."
    },
    {
      icon: Users,
      title: "Collaborative hiring",
      description: "Team-based evaluation with shared scorecards and centralized candidate records."
    },
    {
      icon: Zap,
      title: "Seamless integration",
      description: "Connects to your existing ATS and HR tools, so data syncs without manual entry."
    }
  ];

  return (
    <section className="relative py-24 bg-white text-[#12151B] dark:bg-[#12151B] dark:text-white border-t border-[#12151B]/10 dark:border-white/10 overflow-hidden transition-colors duration-200">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .feat-display { font-family: 'Space Grotesk', sans-serif; }
        .feat-body { font-family: 'IBM Plex Sans', sans-serif; }
        .feat-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* subtle grid texture matching login panel */}
      <div
        className="hidden dark:block absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <div className="feat-mono text-xs tracking-[0.18em] uppercase text-[#3E63DD] dark:text-[#8FA8FF] mb-4">
            Why teams switch
          </div>
          <h2 className="feat-display text-4xl md:text-5xl font-bold text-[#12151B] dark:text-white mb-6 leading-tight">
            Built for how hiring
            <br />
            actually happens
          </h2>
          <p className="feat-body text-lg text-[#6B7280] dark:text-white/60 leading-relaxed">
            Every interview scored the same way, every candidate treated
            fairly, and every result where your team can actually find it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 border-t border-l border-[#12151B]/10 dark:border-white/10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 border-r border-b border-[#12151B]/10 hover:bg-[#FAF8F4] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] transition-colors duration-200"
            >
              {/* accent line that draws in on hover */}
              <span className="absolute top-0 left-0 h-[2px] w-0 bg-[#3E63DD] dark:bg-[#8FA8FF] group-hover:w-full transition-all duration-300 ease-out" />

              <div className="w-10 h-10 rounded-lg bg-[#3E63DD]/[0.08] dark:bg-[#8FA8FF]/10 dark:border dark:border-[#8FA8FF]/20 flex items-center justify-center mb-5 group-hover:bg-[#3E63DD]/[0.12] dark:group-hover:bg-[#8FA8FF]/15 transition-colors">
                <feature.icon className="w-5 h-5 text-[#3E63DD] dark:text-[#8FA8FF]" strokeWidth={1.75} />
              </div>
              <h3 className="feat-display text-lg font-semibold text-[#12151B] dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="feat-body text-[#6B7280] dark:text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;