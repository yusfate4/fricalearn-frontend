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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Mobile state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop toggle state
  const [isImpersonating, setIsImpersonating] = useState(false);

  const isParentRoute = location.pathname.startsWith("/parent");

  useEffect(() => {
    const impersonating = localStorage.getItem("is_impersonating") === "true";
    setIsImpersonating(impersonating);
  }, [user, location]);

  const rawRole = user?.role?.toLowerCase() || "";
  const isAdmin = rawRole === "admin" || Number(user?.is_admin) === 1;
  const isTutor = rawRole === "tutor";
  const isStaff = isAdmin || isTutor;

  const isStudentView =
    rawRole === "student" ||
    (rawRole === "parent" && isImpersonating && !isParentRoute) ||
    isAdmin;

  const isParentView =
    rawRole === "parent" && (isParentRoute || !isImpersonating);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const closeSidebar = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleReturnToParent = () => {
    localStorage.removeItem("is_impersonating");
    localStorage.removeItem("active_student_id");
    window.location.href = "/parent/dashboard";
  };

  return (
    <>
      {/* 📱 MOBILE HAMBURGER (Only visible on small screens) */}
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
        className={`fixed top-0 bottom-0 left-0 z-[80] bg-[#2D5A27] flex flex-col text-white shadow-2xl transition-all duration-300 ease-in-out 
          ${isOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"} 
          ${isCollapsed ? "md:w-24 px-4" : "md:w-72 p-6"}`}
      >
        {/* LOGO & COLLAPSE TOGGLE */}
        <div className={`flex items-center mb-10 pt-4 md:pt-0 ${isCollapsed ? "justify-center" : "justify-between px-4"}`}>
          {!isCollapsed && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-black text-[#F4B400] tracking-tighter uppercase italic leading-none">
                FricaLearn
              </h2>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">
                {isTutor ? "Tutor Portal" : "Diaspora Academy"}
              </p>
            </div>
          )}
          
          {/* Desktop Toggle Button */}
          <button 
            onClick={toggleCollapse}
            className="hidden md:flex p-2 text-white/60 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Mobile Close Button */}
          <button onClick={closeSidebar} className="md:hidden p-2 text-white/60 bg-white/10 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 pr-1">
          <nav className="space-y-1">
            
            {/* --- 🎓 STUDENT MENU --- */}
            {isStudentView && !isTutor && (
              <div className="space-y-1">
                {rawRole === "parent" && isImpersonating && (
                  <button
                    onClick={handleReturnToParent}
                    title="Back to Parent Portal"
                    className={`w-full flex items-center gap-3 bg-white/10 border border-white/10 rounded-[1.2rem] text-yellow-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all 
                      ${isCollapsed ? "px-0 justify-center h-12 mb-4" : "px-4 py-3 mb-6"}`}
                  >
                    <ArrowLeftCircle size={16} /> 
                    {!isCollapsed && <span>Back to Parent Portal</span>}
                  </button>
                )}

                <SectionHeader label="Student" collapsed={isCollapsed} />
                <SidebarLink to="/dashboard" icon={<Home size={20} />} label="Home" active={isActive("/dashboard")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/olu-chat" icon={<Sparkles size={20} className="text-[#F4B400] animate-pulse" />} label="Talk to Olukọ" active={isActive("/olu-chat")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/courses" icon={<BookOpen size={20} />} label="My Lessons" active={isActive("/courses")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" active={isActive("/leaderboard")} collapsed={isCollapsed} onClick={closeSidebar} />
                
                <SectionHeader label="Shop" collapsed={isCollapsed} />
                <SidebarLink to="/store" icon={<Store size={20} className="text-yellow-400" />} label="Marketplace" active={isActive("/store")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/my-rewards" icon={<Package size={20} className="text-blue-400" />} label="My Treasures" active={isActive("/my-rewards")} collapsed={isCollapsed} onClick={closeSidebar} />
              </div>
            )}

            {/* --- 👨‍👩‍👧‍👦 PARENT PORTAL --- */}
            {isParentView && !isStaff && (
              <div className="space-y-1">
                <SectionHeader label="Parent" collapsed={isCollapsed} />
                <SidebarLink to="/parent/dashboard" icon={<ShieldCheck size={20} className="text-green-300" />} label="Overview" active={isActive("/parent/dashboard")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/parent/messages" icon={<MessageCircle size={20} className="text-blue-300" />} label="Chat" active={isActive("/parent/messages")} collapsed={isCollapsed} onClick={closeSidebar} />
              </div>
            )}

            {/* --- 👑 ADMIN ONLY --- */}
            {isAdmin && (
              <div className="mt-2 space-y-1">
                <SectionHeader label="Control" color="text-[#F4B400]" collapsed={isCollapsed} />
                <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive("/admin")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/users" icon={<Users size={20} className="text-green-400" />} label="Students" active={isActive("/admin/users")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/parents" icon={<UserPlus size={20} className="text-blue-400" />} label="Parents" active={isActive("/admin/parents")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/chats" icon={<MessageSquare size={20} className="text-purple-400" />} label="Support" active={isActive("/admin/chats")} collapsed={isCollapsed} onClick={closeSidebar} />
              </div>
            )}

            {/* --- 👨‍🏫 TUTOR ONLY --- */}
            {isTutor && (
              <div className="mt-2 space-y-1">
                <SectionHeader label="Staff" color="text-[#F4B400]" collapsed={isCollapsed} />
                <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive("/admin")} collapsed={isCollapsed} onClick={closeSidebar} />
              </div>
            )}

            {/* --- 👨‍🏫 ACADEMIC --- */}
            {isStaff && (
              <div className="mt-2 space-y-1">
                <SectionHeader label="Academic" collapsed={isCollapsed} />
                <SidebarLink to="/admin/schedule" icon={<Clock size={20} className="text-yellow-200" />} label="Schedule" active={isActive("/admin/schedule")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/live-classes" icon={<Video size={20} className="text-red-400" />} label="Live" active={isActive("/admin/live-classes")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/courses/list" icon={<GraduationCap size={20} />} label="Courses" active={isActive("/admin/courses/list")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/lessons" icon={<BookText size={20} className="text-orange-300" />} label="Lessons" active={isActive("/admin/lessons")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/questions" icon={<HelpCircle size={20} />} label="Quizzes" active={isActive("/admin/questions")} collapsed={isCollapsed} onClick={closeSidebar} />
                <SidebarLink to="/admin/analytics" icon={<BarChart3 size={20} className="text-teal-400" />} label="Analytics" active={isActive("/admin/analytics")} collapsed={isCollapsed} onClick={closeSidebar} />

                {isAdmin && (
                  <>
                    <SectionHeader label="Economy" color="text-red-300" collapsed={isCollapsed} />
                    <SidebarLink to="/admin/payments" icon={<CreditCard size={20} className="text-blue-400" />} label="Payments" active={isActive("/admin/payments")} collapsed={isCollapsed} onClick={closeSidebar} />
                    <SidebarLink to="/admin/payments/history" icon={<History size={20} className="text-orange-200" />} label="History" active={isActive("/admin/payments/history")} collapsed={isCollapsed} onClick={closeSidebar} />
                    <SidebarLink to="/admin/rewards" icon={<Gift size={20} className="text-pink-400" />} label="Redemptions" active={isActive("/admin/rewards")} collapsed={isCollapsed} onClick={closeSidebar} />
                    <SidebarLink to="/admin/manage-rewards" icon={<PlusCircle size={20} className="text-yellow-400" />} label="Inventory" active={isActive("/admin/manage-rewards")} collapsed={isCollapsed} onClick={closeSidebar} />
                  </>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className={`pt-4 border-t border-white/10 mt-auto ${isCollapsed ? "flex justify-center" : ""}`}>
          <button
            onClick={() => {
              localStorage.removeItem("is_impersonating");
              localStorage.removeItem("active_student_id");
              logout();
              closeSidebar();
            }}
            title="Logout"
            className={`flex items-center gap-3 text-red-300 font-bold hover:bg-red-500/10 rounded-[1.5rem] transition-all group ${isCollapsed ? "p-4" : "w-full px-5 py-4"}`}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-sm uppercase tracking-widest font-black italic">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

function SectionHeader({ label, collapsed, color = "text-white/30" }: { label: string; collapsed: boolean; color?: string; }) {
  if (collapsed) return <div className="h-px bg-white/10 my-6 mx-2" />;
  return (
    <p className={`px-4 text-[9px] font-black uppercase tracking-[0.2em] mb-2 mt-4 ${color} animate-in fade-in duration-500`}>
      {label}
    </p>
  );
}

function SidebarLink({ to, icon, label, active, collapsed, onClick }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
      title={collapsed ? label : ""}
      className={`flex items-center gap-3 rounded-[1.2rem] font-bold transition-all group ${
        active
          ? "bg-white/15 text-white shadow-lg ring-1 ring-white/10"
          : "text-white/50 hover:text-white hover:bg-white/5"
      } ${collapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3.5"}`}
    >
      <span className={`${active ? "text-white" : "text-white/40 group-hover:text-white"} transition-colors`}>
        {icon}
      </span>
      {!collapsed && <span className="text-[13px] tracking-tight animate-in slide-in-from-left-2 duration-300">{label}</span>}
    </Link>
  );
}