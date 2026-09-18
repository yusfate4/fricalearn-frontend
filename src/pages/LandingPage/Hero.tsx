import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#2A1650] overflow-hidden flex items-center">

      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Accent glows — purple not green */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(63,33,113,0.5) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,0,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 container mx-auto px-6 py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen lg:min-h-0 lg:py-32">

          {/* ── LEFT: Copy ── */}
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* Trial badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFFF00]/10 border border-[#FFFF00]/30 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FFFF00] animate-pulse"/>
              <span className="text-[#FFFF00] text-[10px] font-black uppercase tracking-[0.3em]">1-month free trial · No card needed</span>
            </div>

            {/* Headline */}
            <h1 className="font-black text-white uppercase leading-[0.9] tracking-tighter mb-8">
              <span className="block text-5xl md:text-6xl lg:text-7xl">World-Class</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl text-[#FFFF00] italic">Education</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl">For African</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl">Children.</span>
            </h1>

            <p className="text-white/60 text-lg font-medium leading-relaxed mb-10 max-w-lg">
              UK National Curriculum Maths and English — 4,788 lessons from Year 1 to Year 11. 
              Heritage languages free forever. AI Tutor available 24/7. 
              Monthly progress reports to parents. One subscription.
            </p>

            {/* Curriculum badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl">
                <span className="text-lg">🇬🇧</span>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-wide leading-none">UK Curriculum</p>
                  <p className="text-white/50 text-[10px] font-medium">Year 1–11 · Oak National Academy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl">
                <span className="text-lg">🌍</span>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-wide leading-none">Heritage Languages</p>
                  <p className="text-white/50 text-[10px] font-medium">Yoruba · Igbo · Hausa — Free</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-wide leading-none">Olukọ AI Tutor</p>
                  <p className="text-white/50 text-[10px] font-medium">All 5 subjects · 24/7</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register"
                className="group flex items-center justify-center gap-3 bg-[#FFFF00] text-[#2A1650] px-8 py-5 rounded-[1.5rem] font-black uppercase text-sm tracking-widest hover:bg-white transition-all shadow-2xl border-b-4 border-yellow-400 active:translate-y-1 active:border-b-0">
                Start Free Trial
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a href="#how-it-works"
                className="group flex items-center justify-center gap-3 bg-white/10 border-2 border-white/30 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase text-sm tracking-widest hover:bg-white hover:text-[#2A1650] transition-all">
                See how it works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["🇳🇬","🇬🇧","🇺🇸","🇨🇦"].map((f,i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#3F2171] border-2 border-[#2A1650] flex items-center justify-center text-xs">{f}</div>
                ))}
              </div>
              <p className="text-white/40 text-sm font-medium">Families from Nigeria, UK, USA & Canada</p>
            </div>
          </div>

          {/* ── RIGHT: Lesson preview card ── */}
          <div className={`transition-all duration-1000 delay-300 hidden lg:block ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative">

              {/* Main card */}
              <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/10">
                <div className="bg-[#3F2171] px-6 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFFF00]"/>
                    <p className="text-[#FFFF00] text-[9px] font-black uppercase tracking-widest">Maths · KS2 · Fractions</p>
                  </div>
                  <h3 className="text-white font-black text-base leading-tight">Unit fractions as part of a whole</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-[#3F2171]/5 rounded-2xl p-4">
                    <p className="text-[#3F2171] font-black text-[9px] uppercase tracking-wide mb-1.5">Learning Goal</p>
                    <p className="text-gray-700 text-sm leading-relaxed">I can identify and explain what a unit fraction represents as part of a whole shape or set.</p>
                  </div>
                  <div className="border-2 border-gray-100 rounded-2xl p-4">
                    <p className="font-black text-gray-800 text-sm mb-3">Which diagram shows ¼ shaded?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Option A","Option B","Option C ✓","Option D"].map((o,i) => (
                        <div key={i} className={`rounded-xl p-2.5 text-xs font-bold text-center ${i===2 ? "bg-green-50 border-2 border-green-400 text-green-700" : "bg-gray-50 border-2 border-gray-100 text-gray-400"}`}>{o}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-wide mb-1.5">Progress</p>
                      <div className="w-36 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3F2171] rounded-full" style={{width:"60%"}}/>
                      </div>
                    </div>
                    <div className="bg-[#FFFF00] text-[#2A1650] text-xs font-black px-3 py-1.5 rounded-full">+15 pts 🎉</div>
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-8 top-8 bg-white rounded-2xl p-4 shadow-2xl">
                <p className="text-2xl font-black text-[#2A1650]">4,788</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">Lessons</p>
              </div>

              <div className="absolute -right-6 top-32 bg-[#FFFF00] rounded-2xl p-4 shadow-2xl">
                <p className="text-2xl font-black text-[#2A1650]">KS1–4</p>
                <p className="text-[#2A1650]/60 text-[10px] font-bold uppercase tracking-wide">Full curriculum</p>
              </div>

              <div className="absolute left-4 -bottom-6 bg-[#3F2171] rounded-2xl px-5 py-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFF00] flex items-center justify-center text-[#2A1650] font-black">Ọ</div>
                  <div>
                    <p className="text-white font-black text-sm">Olukọ AI Tutor</p>
                    <p className="text-white/50 text-[10px]">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row below card */}
            <div className="grid grid-cols-3 gap-4 mt-14">
              {[
                { value: "3",    label: "Languages",    sub: "Yoruba · Igbo · Hausa" },
                { value: "30d",  label: "Free trial",   sub: "No card required" },
                { value: "24/7", label: "AI Tutor",     sub: "All 5 subjects" },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-[#FFFF00] text-[10px] font-black uppercase tracking-widest mt-1">{stat.label}</p>
                  <p className="text-white/40 text-[9px] font-medium mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
