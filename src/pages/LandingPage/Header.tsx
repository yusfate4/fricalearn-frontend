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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Courses", href: "#courses" },
    { name: "Tutors", href: "#tutors" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-[100] transition-all duration-500 ${
          isScrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* 🖼️ Logo Section */}
          <Link to="/" className="flex items-center gap-2 group relative z-[210]">
            <img
              src="/logo.png"
              alt="FricaLearn Logo"
              className={`h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105 ${
                !isScrolled && isMobileMenuOpen ? "brightness-100" : ""
              }`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-bold text-xs uppercase tracking-[0.2em] transition-all hover:text-green-600 ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                {link.name}
              </a>
            ))}

            <div className="flex items-center gap-4 ml-6">
              <Link
                to="/login"
                className={`px-6 py-2.5 font-bold text-xs uppercase tracking-widest rounded-full border-2 transition-all ${
                  isScrolled
                    ? "text-[#1A1A40] border-[#1A1A40] hover:bg-[#1A1A40] hover:text-white"
                    : "text-white border-white hover:bg-white hover:text-[#1A1A40]"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-green-600 text-white text-xs uppercase font-black tracking-widest rounded-full hover:bg-green-700 transition shadow-xl hover:shadow-green-500/20"
              >
                Register
              </Link>
            </div>
          </nav>

          {/* Mobile Toggle Button */}
          <div className="lg:hidden relative z-[210]">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors rounded-full ${
                isMobileMenuOpen 
                ? "text-gray-900 bg-gray-100" 
                : isScrolled ? "text-[#1A1A40]" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-white z-[200] transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen 
          ? "opacity-100 translate-y-0 visible" 
          : "opacity-0 -translate-y-full invisible"
        }`}
      >
        <div className="flex flex-col h-full justify-center items-center px-10 text-center">
          <div className="space-y-6 mb-12">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-4xl font-black text-[#1A1A40] uppercase tracking-tighter transition-all duration-300 delay-${index * 100} ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="w-full max-w-sm space-y-4">
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-5 bg-green-600 text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-5 border-2 border-gray-200 text-[#1A1A40] text-sm font-black uppercase tracking-[0.2em] rounded-2xl"
            >
              Student Login
            </Link>
          </div>
          
          <p className="absolute bottom-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © 2026 FricaLearn Academy
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;