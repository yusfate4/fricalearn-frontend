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
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const isAdmin = user?.role === "admin" || Number(user?.is_admin) === 1;

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
      {/* 📱 MOBILE HAMBURGER - Always visible on small screens when closed */}
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed top-4 left-4 z-[60] p-3 bg-[#2D5A27] text-white rounded-2xl shadow-xl transition-all ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Menu size={24} />
      </button>

      {/* 📱 MOBILE OVERLAY - Only blurred background */}
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
        {/* LOGO AREA - pt-10 ensures it clears mobile status bars */}
        <div className="flex justify-between items-center mb-10 px-4 pt-4 md:pt-0">
          <div>
            <h2 className="text-2xl font-black text-[#F4B400] tracking-tighter uppercase italic leading-none">
              FricaLearn
            </h2>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">
              Diaspora Academy
            </p>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 text-white/60 bg-white/10 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION - overflow-y-auto ensures you can scroll menu items */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 pr-1">
          <nav className="space-y-1">
            {isStudentView && (
              <div className="space-y-1">
                {user?.role === "parent" && isImpersonating && (
                  <button
                    onClick={handleReturnToParent}
                    className="w-full flex items-center gap-3 px-4 py-3 mb-6 bg-white/10 border border-white/10 rounded-[1.2rem] text-yellow-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    <ArrowLeftCircle size={16} /> <span>Parent Portal</span>
                  </button>
                )}

                <SectionHeader label="Student Menu" />
                <SidebarLink
                  to="/dashboard"
                  icon={<Home size={20} />}
                  label="Home"
                  active={isActive("/dashboard")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/olu-chat"
                  icon={<Sparkles size={20} className="text-[#F4B400]" />}
                  label="Talk to Olu (AI)"
                  active={isActive("/olu-chat")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/courses"
                  icon={<BookOpen size={20} />}
                  label="My Lessons"
                  active={isActive("/courses")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/analytics"
                  icon={<BarChart3 size={20} />}
                  label="My Progress"
                  active={isActive("/analytics")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/leaderboard"
                  icon={<Users size={20} />}
                  label="Leaderboard"
                  active={isActive("/leaderboard")}
                  onClick={closeSidebar}
                />

                <SectionHeader label="Rewards & Shop" />
                <SidebarLink
                  to="/store"
                  icon={<Store size={20} className="text-yellow-400" />}
                  label="Marketplace"
                  active={isActive("/store")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/my-rewards"
                  icon={<Package size={20} className="text-blue-400" />}
                  label="My Treasures"
                  active={isActive("/my-rewards")}
                  onClick={closeSidebar}
                />
              </div>
            )}

            {isParentView && !isAdmin && (
              <div className="space-y-1">
                <SectionHeader label="Parent Portal" />
                <SidebarLink
                  to="/parent/dashboard"
                  icon={<ShieldCheck size={20} />}
                  label="Family Overview"
                  active={isActive("/parent/dashboard")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/parent/messages"
                  icon={<MessageCircle size={20} />}
                  label="Tutor Chat"
                  active={isActive("/parent/messages")}
                  onClick={closeSidebar}
                />
              </div>
            )}

            {isAdmin && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-1">
                <SectionHeader label="Admin Control" color="text-[#F4B400]" />
                <SidebarLink
                  to="/admin"
                  icon={<Settings size={20} />}
                  label="Overview"
                  active={isActive("/admin")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/users"
                  icon={<Users size={20} />}
                  label="Students"
                  active={isActive("/admin/users")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/parents"
                  icon={<UserPlus size={20} />}
                  label="Parents"
                  active={isActive("/admin/parents")}
                  onClick={closeSidebar}
                />

                <SectionHeader label="Academic" />
                <SidebarLink
                  to="/admin/schedule"
                  icon={<Clock size={20} />}
                  label="Schedule"
                  active={isActive("/admin/schedule")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/live-classes"
                  icon={<Video size={20} />}
                  label="Live Classes"
                  active={isActive("/admin/live-classes")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/courses/list"
                  icon={<GraduationCap size={20} />}
                  label="Courses"
                  active={isActive("/admin/courses/list")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/lessons"
                  icon={<BookText size={20} />}
                  label="Lessons"
                  active={isActive("/admin/lessons")}
                  onClick={closeSidebar}
                />

                <SectionHeader label="Economics" />
                <SidebarLink
                  to="/admin/payments"
                  icon={<CreditCard size={20} />}
                  label="Payments"
                  active={isActive("/admin/payments")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/rewards"
                  icon={<ShieldCheck size={20} />}
                  label="Orders"
                  active={isActive("/admin/rewards")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/manage-rewards"
                  icon={<PlusCircle size={20} />}
                  label="Inventory"
                  active={isActive("/admin/manage-rewards")}
                  onClick={closeSidebar}
                />
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
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SectionHeader({ label, color = "text-white/30" }: any) {
  return (
    <p
      className={`px-4 text-[9px] font-black uppercase tracking-[0.2em] mb-2 mt-4 ${color}`}
    >
      {label}
    </p>
  );
}

function SidebarLink({ to, icon, label, active, onClick }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-[1.2rem] font-bold transition-all ${
        active
          ? "bg-white/15 text-white shadow-lg"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={active ? "text-white" : "text-white/40"}>{icon}</span>
      <span className="text-[13px] tracking-tight">{label}</span>
    </Link>
  );
}
