import React from 'react';

const features = [
  {
    icon: "🎯",
    title: "Self-Paced Learning",
    description: "Students learn at their own speed — no pressure, no rushing. Every child progresses through lessons when they're ready, building genuine understanding before moving forward.",
    color: "bg-[#2D5A27]",
    textColor: "text-white",
  },
  {
    icon: "📊",
    title: "Monthly Progress Reports",
    description: "Every month, parents receive a detailed report showing exactly what their child has covered, quiz scores, topics mastered, and areas that need more attention.",
    color: "bg-[#F4B400]",
    textColor: "text-[#0E1C0E]",
  },
  {
    icon: "🤖",
    title: "AI Tutor — 24/7",
    description: "Olụkọ AI is always available to explain concepts, answer questions and keep students motivated between learning sessions — day or night, weekday or weekend.",
    color: "bg-white",
    textColor: "text-[#0E1C0E]",
    border: true,
  },
  {
    icon: "👩‍🏫",
    title: "Expert Tutor on Weak Areas",
    description: "Where the monthly report flags a struggling topic, a vetted native tutor is assigned to give targeted, personalised support — so no child falls behind unnoticed.",
    color: "bg-[#0E1C0E]",
    textColor: "text-white",
  },
];

const Tutors: React.FC = () => (
  <section className="py-28 bg-white overflow-hidden" id="tutors">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* Left: Copy */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#2D5A27]" />
            <span className="text-[#2D5A27] font-black text-[10px] uppercase tracking-[0.4em]">
              How It Works
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-[#0E1C0E] leading-none mb-8">
            Learn at Your Pace.<br />
            <span className="text-[#2D5A27]">Tutors Step In</span><br />
            When It Matters.
          </h2>

          <p className="text-gray-500 text-lg font-medium leading-relaxed mb-6">
            FricaLearn is a <strong className="text-[#0E1C0E]">self-tutor platform</strong> — students
            work through lessons independently, guided by Olụkọ AI. Every month,
            parents receive a full progress report. Where gaps are found,
            a qualified tutor is assigned to close them.
          </p>

          <p className="text-gray-500 text-base font-medium leading-relaxed mb-10">
            No fixed timetables. No waiting for a class slot. Just consistent,
            child-led learning with expert human backup exactly when needed.
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "24/7", label: "AI Support" },
              { value: "Monthly", label: "Reports" },
              { value: "Top 5%", label: "Tutors" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-5 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-black text-[#0E1C0E]">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div key={f.title}
              className={`${f.color} ${f.border ? "border-2 border-gray-100 shadow-sm" : "shadow-lg"} rounded-[2.5rem] p-8 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300`}>
              <span className="text-4xl">{f.icon}</span>
              <h3 className={`text-xl font-black uppercase italic tracking-tight leading-tight ${f.textColor}`}>
                {f.title}
              </h3>
              <p className={`text-sm font-medium leading-relaxed ${f.textColor} opacity-80`}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom banner */}
      <div className="mt-20 bg-gray-50 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-gray-100">
        <div className="max-w-2xl">
          <p className="text-[#2D5A27] font-black text-[10px] uppercase tracking-widest mb-3">Our Promise</p>
          <h3 className="text-3xl font-black text-[#0E1C0E] uppercase italic tracking-tighter mb-3">
            No child falls behind unnoticed.
          </h3>
          <p className="text-gray-500 font-medium text-base leading-relaxed">
            Our monthly report system means parents always know exactly where their child stands.
            Every weak area is flagged, and a tutor steps in — not reactively, but proactively,
            every single month.
          </p>
        </div>
        <div className="shrink-0 flex gap-4">
          <div className="w-16 h-16 bg-[#2D5A27] rounded-2xl flex items-center justify-center text-3xl shadow-lg">📋</div>
          <div className="w-16 h-16 bg-[#F4B400] rounded-2xl flex items-center justify-center text-3xl shadow-lg">👩‍🏫</div>
          <div className="w-16 h-16 bg-[#0E1C0E] rounded-2xl flex items-center justify-center text-3xl shadow-lg">🏆</div>
        </div>
      </div>
    </div>
  </section>
);

export default Tutors;
