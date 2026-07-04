import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0E1C0E] text-white pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand & Mission */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tighter italic uppercase">
              Frica<span className="text-[#F4B400]">Learn</span>
            </h3>
            <p className="text-white/50 font-medium text-sm leading-relaxed">
              World-class education for African children — UK curriculum, heritage
              languages, and an AI Tutor, all in one platform.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/fricalearn/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="p-2.5 bg-white/10 border border-white/10 rounded-xl hover:bg-[#2D5A27] transition-colors">
                <FaInstagram size={16} />
              </a>
              <a href="https://x.com/FricaLearn" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                className="p-2.5 bg-white/10 border border-white/10 rounded-xl hover:bg-[#2D5A27] transition-colors">
                <FaTwitter size={16} />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61570586593408" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="p-2.5 bg-white/10 border border-white/10 rounded-xl hover:bg-[#2D5A27] transition-colors">
                <FaFacebookF size={16} />
              </a>
              <a href="https://www.linkedin.com/in/fricalearn/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="p-2.5 bg-white/10 border border-white/10 rounded-xl hover:bg-[#2D5A27] transition-colors">
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-[#F4B400] font-black text-[10px] uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-white/60 font-bold">
              <li><a href="/#about" className="hover:text-white transition">Our Story</a></li>
              <li><a href="/#courses" className="hover:text-white transition">Flagship Courses</a></li>
              <li><a href="/#tutors" className="hover:text-white transition">Tutor Standards</a></li>
              <li><a href="/#faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="/login" className="hover:text-white transition">Student Login</a></li>
            </ul>
          </div>

          {/* Column 3: Learning */}
          <div>
            <h4 className="text-[#F4B400] font-black text-[10px] uppercase tracking-widest mb-6">Learning</h4>
            <ul className="space-y-4 text-sm text-white/60 font-bold">
              <li>Mathematics</li>
              <li>English</li>
              <li>Yoruba for Beginners</li>
              <li>Igbo Heritage Mastery</li>
              <li>Hausa Essentials</li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-[#F4B400] font-black text-[10px] uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-white/60 font-bold">
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-[#2D5A27] shrink-0" />
                <a href="mailto:hello@fricalearn.com" className="hover:text-white transition">
                  hello@fricalearn.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp className="mt-1 text-[#25D366] shrink-0" />
                <a href="https://wa.me/2348174485504" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  +234 817 448 5504
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#2D5A27] shrink-0" />
                <span>Gillingham, England, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-4">
          <p className="font-bold">
            © {currentYear} FRICA SOLUTION LIMITED. A project by{" "}
            <a href="https://hikishdigital.com.ng/" target="_blank" rel="noopener noreferrer"
              className="text-[#F4B400] hover:text-white transition-colors font-black underline underline-offset-4 decoration-white/20">
              The Hikish Digitals
            </a>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/terms" className="font-black text-[10px] uppercase tracking-widest hover:text-[#F4B400] transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="font-black text-[10px] uppercase tracking-widest hover:text-[#F4B400] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="font-black text-[10px] uppercase tracking-widest hover:text-[#F4B400] transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Oak attribution — required by Open Government Licence v3.0 */}
        <p className="text-white/25 font-medium text-[10px] text-center mt-8 leading-relaxed max-w-3xl mx-auto">
          Mathematics and English curriculum content adapted from Oak National Academy, containing public
          sector information licensed under the Open Government Licence v3.0. Oak National Academy does not
          endorse FricaLearn.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
