import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A40] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tighter italic">
              FRICALEARN<span className="text-green-500">.</span>
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Empowering the next generation of African polyglots through elite
              1-on-1 tutoring and innovative AI reinforcement.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/fricalearn/"
                target="_blank"
                className="p-2 bg-indigo-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://x.com/FricaLearn"
                target="_blank"
                className="p-2 bg-indigo-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://web.facebook.com/profile.php?id=61570586593408"
                target="_blank"
                className="p-2 bg-indigo-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/fricalearn/"
                target="_blank"
                className="p-2 bg-indigo-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-green-500">Platform</h4>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li>
                <a href="#about" className="hover:text-white transition">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition">
                  Flagship Courses
                </a>
              </li>
              <li>
                <a href="#tutors" className="hover:text-white transition">
                  Tutor Standards
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition">
                  Student Login
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Languages */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-green-500">Languages</h4>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li>Yoruba for Beginners</li>
              <li>Igbo Heritage Mastery</li>
              <li>Hausa Essentials</li>
              <li>Cultural Etiquette 101</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-green-500">Contact</h4>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-green-500" />
                <span>hello@fricalearn.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-green-500" />
                <span>Gillingham, England, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="pt-8 border-t border-indigo-800 flex flex-col md:flex-row justify-between items-center text-xs text-indigo-300 gap-4">
          <p>
            © {currentYear} FricaLearn. A project by{" "}
            <a
              href="https://hikishdigital.com.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-white transition-colors font-bold underline decoration-indigo-800 underline-offset-4"
            >
              The Hikish Digitals
            </a>
            .
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
