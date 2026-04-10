import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import Courses from "./Courses";
import Tutors from "./Tutors";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Footer from "./Footer";
import Header from "./Header";

const LandingPage: React.FC = () => {
  return (
    <div className="relative antialiased text-gray-900 bg-white selection:bg-green-100 selection:text-green-900">
      {/* Navigation Bar */}
      <Header />

      <main>
        {/* 1. Hero Section - The Hook */}
        <Hero />

        {/* 2. About FricaLearn - The Story */}
        <AboutUs />

        {/* 3. Our Flagship Courses - The Storefront */}
        <Courses />

        {/* 4. Our Standards (Tutors) - The Trust */}
        <Tutors />

        {/* 5. Frequently Asked Questions - The Clarity */}
        <FAQ />

        {/* 6. Contact Us - The Conversion */}
        <Contact />
      </main>

      {/* 7. Footer & Socials */}
      <Footer />

      {/* 🚀 Floating WhatsApp Button */}
      <a
        href="https://wa.me/2348174485504?text=Hello%20FricaLearn!%20I'd%20like%20to%20inquire%20about%20your%20tutors."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-[99] flex items-center justify-center border-4 border-white"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={32} />
      </a>
    </div>
  );
};

export default LandingPage;