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

      {/* ── Background texture ── */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* ── Accent glows ── */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(45,90,39,0.35) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(244,180,0,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-10 container mx-auto px-6 py-32 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen lg:min-h-0 lg:py-32">

          {/* ── LEFT: Copy ── */}
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-[#FFFF00]" />
              <span className="text-[#FFFF00] font-black text-[10px] uppercase tracking-[0.4em]">
                Diaspora Academy
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-black text-white uppercase leading-[0.9] tracking-tighter mb-8">
              <span className="block text-5xl md:text-6xl lg:text-7xl">World-Class</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl text-[#ffff00] italic">Education</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl">For African</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl">Children.</span>
            </h1>

            <p className="text-white/60 text-lg font-medium leading-relaxed mb-10 max-w-lg">
              UK National Curriculum, Nigerian NERDC Curriculum, and African Heritage Languages —
              all in one platform. Pay in Pounds or Naira.
            </p>

            {/* Curriculum badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl">
                <span className="text-lg">🇬🇧</span>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-wide leading-none">UK Curriculum</p>
                  <p className="text-white/50 text-[10px] font-medium">Year 1 – Year 11 · Oak Academy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl">
                <span className="text-lg">🇳🇬</span>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-wide leading-none">Nigerian Curriculum</p>
                  <p className="text-white/50 text-[10px] font-medium">Primary 1 – JSS 3 · NERDC</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl">
                <span className="text-lg">🌍</span>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-wide leading-none">Heritage Languages</p>
                  <p className="text-white/50 text-[10px] font-medium">Yoruba · Igbo · Hausa</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register"
                className="group flex items-center justify-center gap-3 bg-[#3F2171] text-white px-8 py-5 rounded-[1.5rem] font-black uppercase text-sm tracking-widest hover:bg-[#FFFF00] hover:text-black transition-all shadow-2xl border-b-4 border-[#1E1038] hover:border-yellow-600 active:translate-y-1 active:border-b-0">
                Start in Naira ₦
                <span className="text-[#FFFF00] group-hover:text-black transition-colors">→</span>
              </Link>
              <Link to="/register"
                className="group flex items-center justify-center gap-3 bg-white/10 border-2 border-white/30 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase text-sm tracking-widest hover:bg-white hover:text-[#2A1650] transition-all">
                Start in Pounds £
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Stats + Image ── */}
          <div className={`transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* Hero image */}
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                <img src="/hero-learning.png" alt="Child learning with FricaLearn"
                  className="w-full h-[420px] lg:h-[520px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1650]/60 to-transparent" />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-6 top-10 bg-white rounded-2xl p-4 shadow-2xl">
                <p className="text-3xl font-black text-[#2A1650]">3,000+</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Lessons available</p>
              </div>

              <div className="absolute -right-4 bottom-24 bg-[#FFFF00] rounded-2xl p-4 shadow-2xl">
                <p className="text-3xl font-black text-[#2A1650]">2</p>
                <p className="text-[#2A1650]/70 text-xs font-bold uppercase tracking-wide">Curricula</p>
              </div>

              <div className="absolute left-6 -bottom-6 bg-[#3F2171] rounded-2xl px-6 py-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="text-white font-black text-sm">Olụkọ AI Tutor</p>
                    <p className="text-white/60 text-[10px] font-medium">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-14">
              {[
                { value: "3", label: "Languages", sub: "Yoruba · Igbo · Hausa" },
                { value: "97%", label: "Parent Rating", sub: "5★ average score" },
                { value: "100%", label: "Native Tutors", sub: "Vetted educators" },
              ].map((stat) => (
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

      {/* ── Scroll cue ── */}
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
