import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
    <header className={`fixed w-full z-[100] transition-all duration-500 ${
      isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg py-3" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="FricaLearn"
            className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href}
              className={`font-black text-xs uppercase tracking-widest transition-all hover:opacity-70 ${
                isScrolled ? "text-[#2A1650]" : "text-white"
              }`}>
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-3 ml-4">
            <Link to="/login"
              className={`px-5 py-2.5 font-black text-xs uppercase tracking-widest rounded-xl border-2 transition-all ${
                isScrolled
                  ? "text-[#2A1650] border-[#2A1650] hover:bg-[#2A1650] hover:text-white"
                  : "text-white border-white hover:bg-white/10"
              }`}>
              Login
            </Link>
            <Link to="/register"
              className="px-5 py-2.5 bg-[#3F2171] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#FFFF00] hover:text-[#2A1650] transition-all shadow-lg">
              Register Free
            </Link>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2"
          aria-label="Toggle menu">
          {isMobileMenuOpen
            ? <FaTimes size={24} className={isScrolled ? "text-[#2A1650]" : "text-white"} />
            : <FaBars size={24} className={isScrolled ? "text-[#2A1650]" : "text-white"} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#2A1650] fixed inset-0 w-full h-screen flex flex-col items-center justify-center z-[200]">
          <button onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-white p-2">
            <FaTimes size={28} />
          </button>

          <img src="/logo.png" alt="FricaLearn" className="h-14 mb-10 brightness-0 invert" />

          <div className="flex flex-col items-center gap-8 mb-12">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-black text-white uppercase tracking-tight hover:text-[#FFFF00] transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col w-full px-10 gap-4">
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-5 bg-[#3F2171] text-white text-center font-black uppercase text-sm tracking-widest rounded-2xl shadow-xl hover:bg-[#FFFF00] hover:text-[#2A1650] transition-all">
              Register Free
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-5 border-2 border-white/30 text-white text-center font-black uppercase text-sm tracking-widest rounded-2xl hover:border-white transition-all">
              Student Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
