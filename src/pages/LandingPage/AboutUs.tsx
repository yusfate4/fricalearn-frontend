import React from "react";

const AboutUs: React.FC = () => (
  <section className="py-28 bg-white overflow-hidden" id="about">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-16">

        {/* Visual */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
            <img src="/about-culture.png" alt="African heritage and learning"
              className="w-full h-[450px] md:h-[540px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1C0E]/40 to-transparent" />
          </div>
          {/* Decorative blob */}
          <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-[#2D5A27]/10 rounded-full -z-0 hidden md:block" />
          {/* Floating quote */}
          <div className="absolute bottom-10 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl z-20">
            <p className="text-[#0E1C0E] font-bold italic text-sm leading-relaxed mb-3">
              "We don't just teach words; we teach the etiquette, the proverbs,
              and the identity that comes with our mother tongues."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#2D5A27] rounded-full" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Kabir Akinola · Founder, FricaLearn</p>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#2D5A27]" />
            <span className="text-[#2D5A27] font-black text-[10px] uppercase tracking-[0.4em]">Our Vision</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-[#0E1C0E] leading-none mb-8">
            Preserving Heritage Through{" "}
            <span className="text-[#2D5A27]">Modern Connection.</span>
          </h2>

          <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
            FricaLearn was born out of a simple yet profound need: to ensure the sounds of our
            ancestors - Yoruba, Igbo, and Hausa - continue to resonate in the hearts of our children,
            no matter where they are in the world. And now, we've added world-class academics to match.
          </p>

          <div className="space-y-6">
            {[
              {
                num: "01", label: "Human-Centric Learning", color: "bg-[#2D5A27]/10 text-[#2D5A27]",
                desc: "We believe nothing replaces the bond between a student and a master educator. Our tutors are vetted cultural ambassadors.",
              },
              {
                num: "02", label: "Dual Curriculum", color: "bg-[#F4B400]/20 text-[#0E1C0E]",
                desc: "Whether your family is in the UK or Nigeria, your child gets the exact national curriculum they need, in the right currency.",
              },
              {
                num: "03", label: "Innovation for Tradition", color: "bg-[#0E1C0E]/10 text-[#0E1C0E]",
                desc: "Using the AI Tutor companion, we provide 24/7 reinforcement, making language learning accessible and fun for the digital age.",
              },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4">
                <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0`}>
                  {item.num}
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#0E1C0E] uppercase tracking-tight mb-1">{item.label}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs;
