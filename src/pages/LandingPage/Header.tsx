import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Courses", href: "#courses" },
    { name: "Tutors", href: "#tutors" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed w-full z-[100] transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* 🖼️ Logo Integration */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="FricaLearn Logo"
            className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span
            className={`text-xl font-black tracking-tighter hidden sm:block ${
              isScrolled ? "text-[#1A1A40]" : "text-[#1A1A40] md:text-white"
            }`}
          >
            
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-bold text-sm uppercase tracking-widest transition-opacity duration-300 hover:opacity-70 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-3 ml-4">
            <Link
              to="/login"
              className={`px-5 py-2 font-bold rounded-lg transition ${
                isScrolled
                  ? "text-[#1A1A40] border-2 border-[#1A1A40] hover:bg-gray-50"
                  : "text-white border-2 border-white hover:bg-white/10"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              Register
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors ${isScrolled ? "text-[#1A1A40]" : "text-white"}`}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white fixed inset-0 w-full h-screen flex flex-col items-center justify-center space-y-8 z-[200]">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-gray-900 p-2"
          >
            <FaTimes size={32} />
          </button>

          <img src="/logo.png" alt="Logo" className="h-16 mb-4" />

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-black text-[#1A1A40] uppercase tracking-tighter"
            >
              {link.name}
            </a>
          ))}

          <div className="flex flex-col w-full px-10 gap-4 pt-4">
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-4 bg-green-600 text-white text-center font-bold rounded-xl shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-4 border-2 border-[#1A1A40] text-[#1A1A40] text-center font-bold rounded-xl"
            >
              Student Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
