import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/Layout";
import api from "../../api/axios";
import {
  Upload,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  Landmark,
  Info,
  User,
  Mail,
  Lock,
} from "lucide-react";

interface BankAccount {
  currency: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  flag: string;
}

export default function Step4PaymentUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { selectedCourses, currency, mathsGrade, englishGrade, total } =
    location.state || {};

  const [bankDetails, setBankDetails] = useState<{
    ngn: BankAccount;
    gbp: BankAccount;
  } | null>(null);

  const [childName, setChildName] = useState("");
  const [childEmail, setChildEmail] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const res = await api.get("/onboarding/bank-details");
      setBankDetails(res.data.bank_accounts);
    } catch (err) {
      console.error("Failed to load bank details", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceipt(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setReceiptPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }

      setStatus(null);
    }
  };

  const handleSubmitOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!childName.trim()) {
      setStatus({ type: "error", msg: "Please enter child's name" });
      return;
    }
    if (!childEmail.trim()) {
      setStatus({ type: "error", msg: "Please enter child's email" });
      return;
    }
    if (!childPassword.trim() || childPassword.length < 6) {
      setStatus({ type: "error", msg: "Password must be at least 6 characters" });
      return;
    }
    if (!receipt) {
      setStatus({ type: "error", msg: "Please upload your payment receipt" });
      return;
    }

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("parent_id", user?.id.toString() || "");
    formData.append("child_name", childName.trim());
    formData.append("child_email", childEmail.trim());
    formData.append("child_password", childPassword);
    formData.append("selected_courses", JSON.stringify(selectedCourses));
    formData.append("maths_grade", mathsGrade?.toString() || "");
    formData.append("english_grade", englishGrade?.toString() || "");
    formData.append("currency", currency);
    formData.append("total_amount", total.toString());
    formData.append("receipt", receipt);

    try {
      const res = await api.post("/onboarding/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({
        type: "success",
        msg: "🎉 Success! Your child has been enrolled with immediate access. Redirecting...",
      });

      setTimeout(() => {
        navigate("/parent/dashboard");
      }, 2500);
    } catch (err: any) {
      console.error("Submission Error:", err.response?.data);
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to submit. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentBankAccount = currency === "NGN" ? bankDetails?.ngn : bankDetails?.gbp;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-10 md:py-16 pb-32">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#2D5A27] transition-colors mb-8"
        >
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#2D5A27]/10">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Back
          </span>
        </button>

        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
            Step 4 of 4 • Final Step
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-4">
            Complete <span className="text-[#2D5A27]">Payment</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm md:text-base max-w-2xl">
            Transfer to our account and upload your receipt for instant access
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Bank Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary */}
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">
                Payment Summary
              </p>
              <p className="text-sm font-bold text-white/60 uppercase mb-4">
                {selectedCourses.length} Course{selectedCourses.length !== 1 ? "s" : ""} Selected
              </p>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-4xl font-black text-[#F4B400] italic">
                  {currency === "NGN" ? "₦" : "£"}
                  {total?.toLocaleString()}
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-2">
                  Monthly Subscription
                </p>
              </div>
            </div>

            {/* Bank Account Card */}
            {currentBankAccount && (
              <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-[#2D5A27]">
                  <Landmark size={24} />
                  <h3 className="font-black uppercase italic text-sm">
                    Transfer to {currency === "NGN" ? "Naira" : "Pounds"} Account
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Bank Name
                    </p>
                    <p className="text-lg font-black text-gray-800 tracking-tight">
                      {currentBankAccount.bank_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Account Number
                    </p>
                    <p className="text-2xl font-black text-[#2D5A27] tracking-tight">
                      {currentBankAccount.account_number}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Account Name
                    </p>
                    <p className="text-sm font-bold text-gray-500 uppercase">
                      {currentBankAccount.account_name}
                    </p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                  <Info size={20} className="text-blue-600 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-800 leading-relaxed">
                    <strong>Use your child's name as the payment reference</strong> for instant
                    verification!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmitOnboarding} className="space-y-6">
              {/* Child Information Card */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-gray-50">
                <h2 className="text-xl md:text-2xl font-black text-gray-800 italic uppercase tracking-tight mb-6">
                  Child's Information
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <User size={12} className="inline mr-2" />
                      Child's Full Name
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Ada Johnson"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#2D5A27] font-bold text-sm transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <Mail size={12} className="inline mr-2" />
                      Child's Email
                    </label>
                    <input
                      type="email"
                      value={childEmail}
                      onChange={(e) => setChildEmail(e.target.value)}
                      placeholder="ada@example.com"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#2D5A27] font-bold text-sm transition-all"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <Lock size={12} className="inline mr-2" />
                      Create Password (Min. 6 characters)
                    </label>
                    <input
                      type="password"
                      value={childPassword}
                      onChange={(e) => setChildPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#2D5A27] font-bold text-sm transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Receipt Upload Card */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-gray-50">
                <h2 className="text-xl md:text-2xl font-black text-gray-800 italic uppercase tracking-tight mb-6">
                  Upload Receipt
                </h2>

                <label className="block w-full border-4 border-dashed border-gray-100 rounded-[2rem] p-12 text-center cursor-pointer hover:border-[#2D5A27] transition-all bg-gray-50/30 group relative">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf"
                  />
                  {receiptPreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="max-h-48 rounded-2xl shadow-lg"
                      />
                      <p className="text-xs font-black uppercase tracking-wide text-gray-700">
                        {receipt?.name}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400">
                        Click to change
                      </p>
                    </div>
                  ) : receipt ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <Upload size={32} className="text-[#2D5A27]" />
                      </div>
                      <p className="font-black text-gray-700 uppercase text-xs tracking-widest">
                        {receipt.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <Upload size={32} className="text-[#2D5A27]" />
                      </div>
                      <p className="font-black text-gray-700 uppercase text-xs tracking-widest">
                        Click to Upload Receipt
                      </p>
                      <p className="text-[9px] font-bold text-gray-400">
                        JPG, PNG, or PDF • Max 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Status Message */}
              {status && (
                <div
                  className={`p-6 rounded-2xl flex items-center gap-4 animate-in zoom-in duration-300 ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700 border-2 border-green-100"
                      : "bg-red-50 text-red-700 border-2 border-red-100"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <AlertCircle size={24} />
                  )}
                  <span className="font-black uppercase italic tracking-tight text-xs leading-relaxed">
                    {status.msg}
                  </span>
                </div>
              )}

              {/* Auto-Approval Notice */}
              <div className="bg-gradient-to-br from-[#2D5A27] to-[#1a3318] rounded-[2rem] p-6 text-white flex items-start gap-4">
                <ShieldCheck size={24} className="text-[#F4B400] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-black uppercase tracking-wide mb-2">
                    ⚡ Instant Access Guarantee
                  </p>
                  <p className="text-xs font-bold opacity-90 leading-relaxed">
                    Your child will get <strong>immediate access</strong> to all courses upon
                    submission. Our admin will verify the payment within 24 hours.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!childName || !childEmail || !childPassword || !receipt || loading}
                className="w-full bg-[#2D5A27] text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-green-900 active:border-b-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={24} />
                    Complete Enrollment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
