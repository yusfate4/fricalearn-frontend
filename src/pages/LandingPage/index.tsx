import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import Header from "./Header";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import Courses from "./Courses";
import HowItWorks from "./HowItWorks";
import Tutors from "./Tutors";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Footer from "./Footer";

const LandingPage: React.FC = () => (
  <div className="relative antialiased text-gray-900 bg-white selection:bg-green-100 selection:text-green-900">
    <Header />
    <main>
      <Hero />
      <Courses />
      <HowItWorks />
      <AboutUs />
      <Tutors />
      <FAQ />
      <Contact />
    </main>
    <Footer />

    {/* WhatsApp button */}
    <a href="https://wa.me/2348174485504?text=Hello%20FricaLearn!%20I'd%20like%20to%20enquire%20about%20your%20courses."
      target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-[99] flex items-center justify-center border-4 border-white">
      <FaWhatsapp size={32} />
    </a>
  </div>
);

export default LandingPage;
