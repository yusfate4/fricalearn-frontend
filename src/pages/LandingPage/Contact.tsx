import React, { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "parent",
    message: "",
    _honeypot: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal State

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData._honeypot) return;

    setIsSubmitting(true);

    try {
      // 🚀 PRODUCTION ENDPOINT: Update this with your Railway URL
      // const response = await fetch('https://your-api.railway.app/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Artificial delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show Custom Modal instead of alert
      setShowModal(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "parent",
        message: "",
        _honeypot: "",
      });
    } catch (error) {
      console.error("Submission error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white" id="contact">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-indigo-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          {/* Left Side: Contact Info */}
          <div className="w-full md:w-1/3 bg-indigo-800 p-10 text-white">
            <h3 className="text-3xl font-bold mb-6 italic tracking-tighter">
              FricaLearn.
            </h3>
            <p className="text-indigo-100 mb-10 leading-relaxed">
              Have questions about our curriculum or want to partner with us?
              Our team is ready to assist you.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-green-400">Location</h4>
                <p className="text-sm">Gillingham, England, United Kingdom</p>
              </div>
              <div>
                <h4 className="font-bold text-green-400">Email</h4>
                <p className="text-sm">hello@fricalearn.com</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-2/3 bg-white p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                onChange={(e) =>
                  setFormData({ ...formData, _honeypot: e.target.value })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none transition"
                    placeholder="Enter your name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none transition"
                    placeholder="email@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  I am a...
                </label>
                <select
                  value={formData.role}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none transition font-semibold text-gray-700"
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="parent">Parent interested in lessons</option>
                  <option value="tutor">
                    Qualified Tutor applying to join
                  </option>
                  <option value="partner">Potential Partner/Investor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none transition"
                  placeholder="How can we help you?"
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 transition-all shadow-lg uppercase tracking-widest ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Processing..." : "Send Message 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- 🏆 SUCCESS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
            <div className="flex justify-center mb-6">
              <FaCheckCircle className="text-green-500" size={80} />
            </div>
            <h3 className="text-2xl font-black text-[#1A1A40] mb-2 uppercase">
              Ẹ ṣé!
            </h3>
            <p className="text-gray-600 mb-8 font-medium">
              Thank you for reaching out to FricaLearn. Our team will contact
              you shortly.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-[#1A1A40] text-white font-bold rounded-xl shadow-lg hover:bg-indigo-800 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
