import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  LogOut,
  Settings,
  Home,
  GraduationCap,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HelpCircle } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth(); // Assuming your hook has a logout function
  const location = useLocation();

  // Helper to highlight the current page
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#2D5A27] h-screen flex flex-col p-6 text-white shadow-xl">
      <div className="px-4 mb-10">
        <h2 className="text-2xl font-black text-[#F4B400] tracking-tighter">
          FricaLearn
        </h2>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
          Diaspora Academy
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {/* --- STUDENT SECTION --- */}
        <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
          Student Menu
        </p>
        <SidebarLink
          to="/dashboard"
          icon={<Home size={20} />}
          label="Home"
          active={isActive("/dashboard")}
        />
        <SidebarLink
          to="/courses"
          icon={<BookOpen size={20} />}
          label="My Lessons"
          active={isActive("/courses")}
        />
        <SidebarLink
          to="/leaderboard"
          icon={<Users size={20} />}
          label="Leaderboard"
          active={isActive("/leaderboard")}
        />

        {/* --- FOUNDER'S MENU (LMS-01) --- */}
        {/* Only shows if user is an admin */}
        {user?.is_admin == 1 && (
          <div className="mt-10 pt-8 border-t border-white/10 space-y-2">
            <p className="px-4 text-[10px] font-black text-[#F4B400] uppercase tracking-widest mb-4">
              Founder's Control
            </p>
            <SidebarLink
              to="/admin"
              icon={<Settings size={20} />}
              label="Control Room"
              active={isActive("/admin")}
            />
            <SidebarLink
              to="/admin/courses"
              icon={<GraduationCap size={20} />}
              label="Manage Subjects"
              active={isActive("/admin/courses")}
            />
            <SidebarLink
              to="/admin/lessons/new"
              icon={<Video size={20} />}
              label="Upload Content"
              active={isActive("/admin/lessons/new")}
            />
            {/* 👈 ADD THIS NEW LINK HERE */}
            <SidebarLink
              to="/admin/questions"
              icon={<HelpCircle size={20} />}
              label="Quiz Builder"
              active={isActive("/admin/questions")}
            />
          </div>
        )}
      </nav>

      {/* Logout Section */}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 px-4 py-4 text-red-300 font-bold hover:bg-white/5 rounded-2xl transition-all group"
      >
        <LogOut
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>Logout</span>
      </button>
    </aside>
  );
}

// Helper component for clean links
function SidebarLink({ to, icon, label, active }: any) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
        active
          ? "bg-white/10 text-white shadow-inner"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}
