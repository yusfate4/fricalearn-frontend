import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden" id="about">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Visual Element: Cultural Imagery */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/about-culture.png"
                alt="African heritage and learning"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
            {/* Decorative Background Element */}
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-green-100 rounded-full -z-0 hidden md:block"></div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-indigo-900 font-bold tracking-widest uppercase text-sm mb-4">
              Our Vision
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Preserving Heritage Through{" "}
              <span className="text-green-600">Modern Connection.</span>
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              FricaLearn was born out of a simple yet profound need: to ensure
              the sounds of our ancestors—Yoruba, Igbo, and Hausa—continue to
              resonate in the hearts of our children, no matter where they are
              in the world.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-900 font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Human-Centric Learning
                  </h4>
                  <p className="text-gray-600">
                    We believe nothing replaces the bond between a student and a
                    master educator. Our tutors are vetted cultural ambassadors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-900 font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Innovation for Tradition
                  </h4>
                  <p className="text-gray-600">
                    Using the Olukọ AI companion, we provide 24/7 reinforcement,
                    making language learning accessible and fun for the digital
                    age.
                  </p>
                </div> 
              </div>
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-xl border-l-4 border-indigo-900 italic text-gray-700">
              "We don't just teach words; we teach the etiquette, the proverbs,
              and the identity that comes with our mother tongues."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
