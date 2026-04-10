import React from "react";
import { Link } from "react-router-dom";

// 1. Updated Interface with imageUrl
interface Course {
  id: number;
  title: string;
  level: string;
  description: string;
  highlight: string;
  color: string; // Used for border and icon fallback color
  imageUrl: string; // Path to your images (e.g., yoruba-card.png)
  fallbackIcon: string; // Kept as a graceful fallback/decorative element
}

const Courses: React.FC = () => {
  const courses: Course[] = [
    {
      id: 1,
      title: "Yoruba Mastery",
      level: "Beginner - Advanced",
      description:
        "From basic greetings (Oṣe!) to advanced proverbs and Omoluabi etiquette.",
      highlight: "Cultural Etiquette Focus",
      color: "border-green-600",
      imageUrl: "../src/assets/yoruba-card.png",
      fallbackIcon: "🇳🇬",
    },
    {
      id: 2,
      title: "Igbo Heritage",
      level: "Beginner - Intermediate",
      description:
        "Master the tonal nuances of Igbo and learn the rich history of the Nri Kingdom.",
      highlight: "History & Tones Focus",
      color: "border-red-600",
      imageUrl: "../src/assets/igbo-card.png",
      fallbackIcon: "🦁",
    },
    {
      id: 3,
      title: "Hausa Essentials",
      level: "Beginner - Intermediate",
      description:
        "Navigate the language of trade and hospitality used across the Sahel.",
      highlight: "Trade & Travel Focus",
      color: "border-blue-600",
      imageUrl: "../src/assets/hausa-card.png",
      fallbackIcon: "🕌",
    },
  ];

  return (
    <section className="py-20 bg-gray-50" id="courses">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-4">
            Curriculum
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#1A1A40]">
            Our Flagship <span className="text-indigo-900">Programs</span>
          </h3>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Each course is designed by native educators to bridge the gap
            between spoken word and lived culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-3xl overflow-hidden border-b-8 ${course.color} shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col`}
            >
              {/* 2. Responsive Image Container with proper Aspect Ratio */}
              <div className="relative aspect-[16/9] overflow-hidden group">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Visual Overlay to make text and colors pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Card Content Area (p-8 shifted inside) */}
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-2xl font-bold text-gray-900">
                      {course.title}
                    </h4>
                    {/* Fallback Icon (now smaller, decorative) */}
                    <span className="text-2xl pt-1">{course.fallbackIcon}</span>
                  </div>

                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
                    {course.level}
                  </span>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="bg-indigo-50 p-4 rounded-xl mb-8">
                    <p className="text-indigo-900 text-sm font-semibold flex items-center gap-2">
                      ✨ {course.highlight}
                    </p>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="w-full py-4 bg-[#1A1A40] text-white font-bold rounded-xl hover:bg-indigo-800 transition shadow-md text-center block"
                >
                  Register Now 🚀
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
