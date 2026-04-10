import React from 'react';
import { FaUserCheck, FaGraduationCap, FaShieldAlt, FaMicrophoneAlt } from 'react-icons/fa';

interface Standard {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Tutors: React.FC = () => {
  const standards: Standard[] = [
    {
      id: 1,
      title: "Native Proficiency",
      description: "Every tutor is a native speaker with a deep grasp of tonal nuances, proverbs, and cultural context.",
      icon: <FaMicrophoneAlt className="text-3xl text-indigo-600" />
    },
    {
      id: 2,
      title: "Certified Educators",
      description: "We only hire tutors with proven teaching experience and a passion for child pedagogy.",
      icon: <FaGraduationCap className="text-3xl text-indigo-600" />
    },
    {
      id: 3,
      title: "Vetted & Verified",
      description: "Safety is our priority. All tutors undergo rigorous background checks and identity verification.",
      icon: <FaUserCheck className="text-3xl text-indigo-600" />
    },
    {
      id: 4,
      title: "Safe Environment",
      description: "All live sessions are conducted in a secure, monitored digital classroom designed for children.",
      icon: <FaShieldAlt className="text-3xl text-indigo-600" />
    }
  ];

  return (
    <section className="py-20 bg-white" id="tutors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Heading Content */}
          <div className="w-full lg:w-2/5">
            <h2 className="text-indigo-900 font-bold uppercase tracking-widest text-sm mb-4">
              Quality Assurance
            </h2>
            <h3 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              The Gold Standard of <span className="text-green-600">African Education.</span>
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We don't just match you with a speaker; we match you with a mentor. Our selection process is designed to ensure your child receives world-class instruction.
            </p>
            
            {/* Desktop Button - Links to FAQ for more details on vetting */}
            <a 
              href="#faq"
              className="hidden lg:inline-block px-8 py-4 border-2 border-indigo-900 text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition text-center"
            >
              Learn about our Vetting
            </a>
          </div>

          {/* Right: Standards Grid */}
          <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-8">
            {standards.map((standard) => (
              <div 
                key={standard.id} 
                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group"
              >
                <div className="mb-4 bg-white w-14 h-14 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-600 transition-colors duration-300">
                  {/* Micro-interaction: Icon changes color to white on card hover */}
                  {React.cloneElement(standard.icon as React.ReactElement, { 
                    className: `text-3xl text-indigo-600 group-hover:text-white transition-colors duration-300` 
                  })}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{standard.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Only Button */}
          <div className="w-full lg:hidden">
            <a 
              href="#faq"
              className="block w-full px-8 py-4 border-2 border-indigo-900 text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition text-center"
            >
              Learn about our Vetting
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Tutors;