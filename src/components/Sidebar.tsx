import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Video,
  Users,
  LogOut,
  Settings,
  Home,
  GraduationCap,
  HelpCircle,
  Store,
  Package,
  Menu,
  X,
  CreditCard,
  PlusCircle,
  MessageSquare,
  MessageCircle,
  BarChart3,
  UserPlus,
  BookText,
  ShieldCheck,
  ArrowLeftCircle,
  Sparkles,
  Clock,
  History,
  Trophy,
  UserCircle,
  LayoutDashboard,
  Gift,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const isParentRoute = location.pathname.startsWith("/parent");

  useEffect(() => {
    const impersonating = localStorage.getItem("is_impersonating") === "true";
    setIsImpersonating(impersonating);
  }, [user, location]);

  // --- 👑 ROLE HELPERS ---
  const isAdmin = user?.role === "admin" || Number(user?.is_admin) === 1;
  const isTutor = user?.role === "tutor";
  const isStaff = isAdmin || isTutor;

  const isStudentView =
    user?.role === "student" ||
    (user?.role === "parent" && isImpersonating && !isParentRoute) ||
    isAdmin;

  const isParentView =
    user?.role === "parent" && (isParentRoute || !isImpersonating);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const closeSidebar = () => setIsOpen(false);

  const handleReturnToParent = () => {
    localStorage.removeItem("is_impersonating");
    localStorage.removeItem("active_student_id");
    window.location.href = "/parent/dashboard";
  };

  return (
    <>
      {/* 📱 MOBILE HAMBURGER */}
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed top-4 left-4 z-[60] p-3 bg-[#2D5A27] text-white rounded-2xl shadow-xl transition-all ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Menu size={24} />
      </button>

      {/* 📱 MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-[70] backdrop-blur-[2px] transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* 🏠 MAIN SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-[80] w-72 bg-[#2D5A27] flex flex-col p-6 text-white shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO AREA */}
        <div className="flex justify-between items-center mb-10 px-4 pt-4 md:pt-0">
          <div>
            <h2 className="text-2xl font-black text-[#F4B400] tracking-tighter uppercase italic leading-none">
              FricaLearn
            </h2>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">
              {isTutor ? "Tutor Portal" : "Diaspora Academy"}
            </p>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 text-white/60 bg-white/10 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 pr-1">
          <nav className="space-y-1">
            
            {/* --- 🎓 STUDENT MENU --- */}
            {isStudentView && !isTutor && (
              <div className="space-y-1">
                {user?.role === "parent" && isImpersonating && (
                  <button
                    onClick={handleReturnToParent}
                    className="w-full flex items-center gap-3 px-4 py-3 mb-6 bg-white/10 border border-white/10 rounded-[1.2rem] text-yellow-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    <ArrowLeftCircle size={16} />{" "}
                    <span>Back to Parent Portal</span>
                  </button>
                )}

                <SectionHeader label="Student Menu" />
                <SidebarLink to="/dashboard" icon={<Home size={20} />} label="Home" active={isActive("/dashboard")} onClick={closeSidebar} />
                <SidebarLink to="/olu-chat" icon={<Sparkles size={20} className="text-[#F4B400] animate-pulse" />} label="Talk to Olukọ" active={isActive("/olu-chat")} onClick={closeSidebar} />
                <SidebarLink to="/courses" icon={<BookOpen size={20} />} label="My Lessons" active={isActive("/courses")} onClick={closeSidebar} />
                <SidebarLink to="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" active={isActive("/leaderboard")} onClick={closeSidebar} />
                
                <SectionHeader label="Rewards & Shop" />
                <SidebarLink to="/store" icon={<Store size={20} className="text-yellow-400" />} label="Marketplace" active={isActive("/store")} onClick={closeSidebar} />
                <SidebarLink to="/my-rewards" icon={<Package size={20} className="text-blue-400" />} label="My Treasures" active={isActive("/my-rewards")} onClick={closeSidebar} />
              </div>
            )}

            {/* --- 👨‍👩‍👧‍👦 PARENT PORTAL (Visible to Parents only) --- */}
            {isParentView && !isStaff && (
              <div className="space-y-1">
                <SectionHeader label="Parent Portal" />
                <SidebarLink to="/parent/dashboard" icon={<ShieldCheck size={20} className="text-green-300" />} label="Family Overview" active={isActive("/parent/dashboard")} onClick={closeSidebar} />
                <SidebarLink to="/parent/messages" icon={<MessageCircle size={20} className="text-blue-300" />} label="Admin Chat" active={isActive("/parent/messages")} onClick={closeSidebar} />
              </div>
            )}

            {/* --- 👑 ADMIN ONLY: DATABASES & CHATS --- */}
            {isAdmin && (
              <div className="mt-2 space-y-1">
                <SectionHeader label="Staff Control Room" color="text-[#F4B400]" />
                <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Admin Dashboard" active={isActive("/admin")} onClick={closeSidebar} />
                <SidebarLink to="/admin/users" icon={<Users size={20} className="text-green-400" />} label="Student Database" active={isActive("/admin/users")} onClick={closeSidebar} />
                <SidebarLink to="/admin/parents" icon={<UserPlus size={20} className="text-blue-400" />} label="Parent Database" active={isActive("/admin/parents")} onClick={closeSidebar} />
                <SidebarLink to="/admin/chats" icon={<MessageSquare size={20} className="text-purple-400" />} label="Support Inbox" active={isActive("/admin/chats")} onClick={closeSidebar} />
              </div>
            )}

            {/* --- 👨‍🏫 ACADEMIC CONTENT (Visible to Admin & Tutor) --- */}
            {isStaff && (
              <div className="mt-2 space-y-1">
                <SectionHeader label="Academic Content" />
                <SidebarLink to="/admin/schedule" icon={<Clock size={20} className="text-yellow-200" />} label="Master Schedule" active={isActive("/admin/schedule")} onClick={closeSidebar} />
                <SidebarLink to="/admin/live-classes" icon={<Video size={20} className="text-red-400" />} label="Live Classes" active={isActive("/admin/live-classes")} onClick={closeSidebar} />
                <SidebarLink to="/admin/courses/list" icon={<GraduationCap size={20} />} label="Course List" active={isActive("/admin/courses/list")} onClick={closeSidebar} />
                <SidebarLink to="/admin/lessons" icon={<BookText size={20} className="text-orange-300" />} label="Lesson Manager" active={isActive("/admin/lessons")} onClick={closeSidebar} />
                <SidebarLink to="/admin/questions" icon={<HelpCircle size={20} />} label="Quiz Builder" active={isActive("/admin/questions")} onClick={closeSidebar} />
                <SidebarLink to="/admin/analytics" icon={<BarChart3 size={20} className="text-teal-400" />} label="Learning Analytics" active={isActive("/admin/analytics")} onClick={closeSidebar} />

                {/* --- 💰 FOUNDER ONLY: ECONOMICS --- */}
                {isAdmin && (
                  <>
                    <SectionHeader label="Economics" color="text-red-300" />
                    <SidebarLink to="/admin/payments" icon={<CreditCard size={20} className="text-blue-400" />} label="Verify Payments" active={isActive("/admin/payments")} onClick={closeSidebar} />
                    <SidebarLink to="/admin/rewards" icon={<Gift size={20} className="text-pink-400" />} label="Redemptions" active={isActive("/admin/rewards")} onClick={closeSidebar} />
                    <SidebarLink to="/admin/manage-rewards" icon={<PlusCircle size={20} className="text-yellow-400" />} label="Shop Inventory" active={isActive("/admin/manage-rewards")} onClick={closeSidebar} />
                  </>
                )}

                {/* --- ⚙️ SETTINGS --- */}
                <SectionHeader label="Account" />
                <SidebarLink to="/admin/profile" icon={<UserCircle size={20} className="text-gray-300" />} label={isTutor ? "Tutor Credentials" : "Admin Profile"} active={isActive("/admin/profile")} onClick={closeSidebar} />
              </div>
            )}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("is_impersonating");
              localStorage.removeItem("active_student_id");
              logout();
              closeSidebar();
            }}
            className="w-full flex items-center gap-3 px-5 py-4 text-red-300 font-bold hover:bg-red-500/10 rounded-[1.5rem] transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest font-black italic">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SectionHeader({ label, color = "text-white/30" }: { label: string; color?: string; }) {
  return (
    <p className={`px-4 text-[9px] font-black uppercase tracking-[0.2em] mb-2 mt-4 ${color}`}>
      {label}
    </p>
  );
}

function SidebarLink({ to, icon, label, active, onClick }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-[1.2rem] font-bold transition-all group ${
        active
          ? "bg-white/15 text-white shadow-lg ring-1 ring-white/10"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={`${active ? "text-white" : "text-white/40 group-hover:text-white"} transition-colors`}>
        {icon}
      </span>
      <span className="text-[13px] tracking-tight">{label}</span>
    </Link>
  );
}