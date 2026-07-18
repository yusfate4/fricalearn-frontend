import React, { useState } from "react";
import { FaCheckCircle, FaTimes, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import api from "../../api/axios";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", role: "parent", message: "", _honeypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [error, setError]               = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData._honeypot) return;
    setIsSubmitting(true);
    setError("");
    try {
      await api.post("/contact", formData);
      setShowModal(true);
      setFormData({ name: "", email: "", role: "parent", message: "", _honeypot: "" });
    } catch (err: any) {
      console.error("Submission error", err);
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = "w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#3F2171] focus:ring-0 outline-none font-medium text-gray-700 transition-all";

  return (
    <section className="py-20 bg-gray-50" id="contact">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#3F2171]" />
            <span className="text-[#3F2171] font-black text-[10px] uppercase tracking-[0.4em]">Get In Touch</span>
            <span className="h-px w-10 bg-[#3F2171]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#2A1650] leading-none mb-4">
            Let's <span className="text-[#3F2171]">Talk.</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Have questions about our curriculum? Want to partner with us?
            Our team is ready to help.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Info panel */}
          <div className="lg:col-span-2 bg-[#2A1650] rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">FricaLearn.</h3>
              <p className="text-white/60 font-medium text-sm leading-relaxed mb-10">
                Raising bilingual achievers — one lesson at a time.
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-[#FFFF00] font-black text-[10px] uppercase tracking-widest mb-2">Location</p>
                  <p className="text-white/80 font-medium text-sm">Gillingham, England, United Kingdom</p>
                </div>
                <div>
                  <p className="text-[#FFFF00] font-black text-[10px] uppercase tracking-widest mb-2">Email</p>
                  <a href="mailto:hello@fricalearn.com"
                    className="text-white/80 font-medium text-sm hover:text-[#FFFF00] transition-colors">
                    hello@fricalearn.com
                  </a>
                </div>
                <div>
                  <p className="text-[#FFFF00] font-black text-[10px] uppercase tracking-widest mb-2">WhatsApp</p>
                  <a href="https://wa.me/2348174485504" target="_blank" rel="noopener noreferrer"
                    className="text-white/80 font-medium text-sm hover:text-[#FFFF00] transition-colors">
                    +234 817 448 5504
                  </a>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-10">
              <p className="text-[#FFFF00] font-black text-[10px] uppercase tracking-widest mb-4">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { icon: <FaInstagram size={18}/>, href: "https://www.instagram.com/fricalearn/" },
                  { icon: <FaTwitter size={18}/>, href: "https://x.com/FricaLearn" },
                  { icon: <FaWhatsapp size={18}/>, href: "https://wa.me/2348174485504" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-[#3F2171] hover:border-[#3F2171] transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-gray-100">
            <h3 className="text-2xl font-black uppercase italic tracking-tight text-[#2A1650] mb-8">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot */}
              <input type="text" className="hidden" tabIndex={-1} autoComplete="off"
                onChange={(e) => setFormData({ ...formData, _honeypot: e.target.value })}/>

              {/* Name + Email — stack on mobile, side by side on md+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input type="text" required value={formData.name} placeholder="Enter your name"
                    className={field}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input type="email" required value={formData.email} placeholder="email@example.com"
                    className={field}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  I am a...
                </label>
                <select value={formData.role} className={field}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="parent">Parent interested in lessons</option>
                  <option value="tutor">Qualified Tutor applying to join</option>
                  <option value="partner">Potential Partner / Investor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Message
                </label>
                <textarea rows={5} required value={formData.message}
                  placeholder="How can we help you?"
                  className={field}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}/>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button type="submit" disabled={isSubmitting}
                className={`w-full py-5 bg-[#3F2171] text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-lg hover:bg-[#FFFF00] hover:text-[#2A1650] transition-all border-b-4 border-[#1E1038] hover:border-yellow-600 active:translate-y-1 active:border-b-0 ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}>
                {isSubmitting ? "Sending..." : "Send Message 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-300 hover:text-gray-600 transition-colors">
              <FaTimes size={20}/>
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-500" size={48}/>
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#2A1650] mb-2 uppercase italic tracking-tight">Ẹ ṣé! 🎉</h3>
            <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">
              Thank you for reaching out! Our team will get back to you at{" "}
              <strong className="text-[#2A1650]">hello@fricalearn.com</strong> shortly.
            </p>
            <button onClick={() => setShowModal(false)}
              className="w-full py-4 bg-[#2A1650] text-white font-black rounded-2xl uppercase tracking-widest text-sm hover:bg-[#3F2171] transition-all">
              Back to Home
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
