import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:flex lg:items-center">
        <div className="lg:w-1/2">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1A1A40] leading-tight">
            Learn Your Language.{" "}
            <span className="text-green-600">Live Your Culture.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-lg">
            Connect your child with elite native tutors for 1-on-1 lessons in
            Yoruba, Igbo, and Hausa. Powered by human expertise and reinforced
            by Olukọ AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {/* Primary CTA: Anchor to Contact Section */}
            <a
              href="#contact"
              className="px-8 py-4 bg-indigo-900 text-white font-bold rounded-xl hover:bg-indigo-800 transition shadow-lg text-center"
            >
              Find a Tutor
            </a>

            {/* Secondary CTA: Anchor to Courses Section */}
            <a
              href="#courses"
              className="px-8 py-4 border-2 border-indigo-900 text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition text-center"
            >
              Explore Courses
            </a>
          </div>
        </div>

        <div className="mt-12 lg:mt-0 lg:w-1/2 relative">
          <div className="rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
            <img
              src="/hero-learning.png"
              alt="Child learning with a FricaLearn Tutor"
              className="w-full object-cover h-[500px]"
            />
          </div>

          {/* Subtle Cultural Badge (Optional extra "stunning" touch) */}
          <div className="absolute -bottom-4 -right-4 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold hidden md:block rotate-3">
            100% Native Tutors 🇳🇬
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
