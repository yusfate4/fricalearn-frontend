import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCookieBite } from "react-icons/fa";

const CONSENT_KEY = "fricalearn_cookie_consent"; // "accepted" | "rejected"

/**
 * Cookie consent banner.
 * Shows once per browser until the visitor makes a choice.
 * Note: essential cookies (login session) always run — the banner explains this.
 * If analytics/marketing cookies are added later, gate them on:
 *   localStorage.getItem("fricalearn_cookie_consent") === "accepted"
 */
const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if no choice has been made yet
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      /* storage unavailable — don't block the site */
    }
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-[#2A1650] text-white rounded-[2rem] shadow-2xl border border-white/10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* Icon + copy */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-[#FFFF00] rounded-2xl flex items-center justify-center shrink-0">
              <FaCookieBite size={22} className="text-[#2A1650]" />
            </div>
            <div>
              <p className="font-black text-sm uppercase italic tracking-tight mb-1">
                We keep cookies to a minimum 🍪
              </p>
              <p className="text-white/60 font-medium text-xs leading-relaxed">
                FricaLearn uses <strong className="text-white/90">essential cookies only</strong> — the ones
                needed to log you in and keep the platform working. No advertising, no third-party trackers.
                Essential cookies stay on either way (the site can't work without them).{" "}
                <Link to="/cookies" className="text-[#FFFF00] font-black underline hover:text-white transition-colors">
                  Read our Cookie Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => choose("rejected")}
              className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl border-2 border-white/20 text-white/70 font-black text-[10px] uppercase tracking-widest hover:border-white/50 hover:text-white transition-all"
            >
              Essential Only
            </button>
            <button
              onClick={() => choose("accepted")}
              className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl bg-[#3F2171] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#FFFF00] hover:text-[#2A1650] transition-all shadow-lg"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
