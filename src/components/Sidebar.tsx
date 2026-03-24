import React, { useState } from "react";
import {
  LayoutDashboard,
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
  PlusCircle,
  MessageSquare, // 👈 1. Added MessageSquare icon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* --- MOBILE HAMBURGER BUTTON --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#2D5A27] text-white rounded-xl shadow-lg hover:bg-green-800 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* --- MOBILE BACKDROP --- */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2D5A27] h-screen flex flex-col p-6 text-white shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-10 px-4 mt-2 md:mt-0">
          <div>
            <h2 className="text-2xl font-black text-[#F4B400] tracking-tighter">
              FricaLearn
            </h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              Diaspora Academy
            </p>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden p-1 text-white/60 hover:text-white bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
          <nav className="space-y-2">
            {/* --- STUDENT SECTION --- */}
            <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 mt-4">
              Student Menu
            </p>
            <SidebarLink
              to="/dashboard"
              icon={<Home size={20} />}
              label="Home"
              active={isActive("/dashboard")}
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
              to="/leaderboard"
              icon={<Users size={20} />}
              label="Leaderboard"
              active={isActive("/leaderboard")}
              onClick={closeSidebar}
            />
            <SidebarLink
              to="/store"
              icon={<Store size={20} className="text-yellow-400" />}
              label="Reward Store"
              active={isActive("/store")}
              onClick={closeSidebar}
            />

            {/* 👈 2. NEW: Student Messages Link */}
            <SidebarLink
              to="/messages"
              icon={<MessageSquare size={20} className="text-blue-300" />}
              label="Messages"
              active={isActive("/messages")}
              onClick={closeSidebar}
            />

            {/* --- FOUNDER'S MENU --- */}
            {user?.is_admin == 1 && (
              <div className="mt-8 pt-8 border-t border-white/10 space-y-2">
                <p className="px-4 text-[10px] font-black text-[#F4B400] uppercase tracking-widest mb-4">
                  Founder's Control
                </p>
                <SidebarLink
                  to="/admin"
                  icon={<Settings size={20} />}
                  label="Control Room"
                  active={isActive("/admin")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/courses"
                  icon={<GraduationCap size={20} />}
                  label="Manage Subjects"
                  active={isActive("/admin/courses")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/lessons/new"
                  icon={<Video size={20} />}
                  label="Upload Content"
                  active={isActive("/admin/lessons/new")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/questions"
                  icon={<HelpCircle size={20} />}
                  label="Quiz Builder"
                  active={isActive("/admin/questions")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/rewards"
                  icon={<Package size={20} className="text-orange-400" />}
                  label="Reward Orders"
                  active={isActive("/admin/rewards")}
                  onClick={closeSidebar}
                />
                <SidebarLink
                  to="/admin/manage-rewards"
                  icon={<PlusCircle size={20} className="text-yellow-400" />}
                  label="Manage Store"
                  active={isActive("/admin/manage-rewards")}
                  onClick={closeSidebar}
                />

                {/* 👈 3. NEW: Admin Chat Management Link */}
                <SidebarLink
                  to="/admin/chats"
                  icon={<MessageSquare size={20} className="text-green-400" />}
                  label="Student Chats"
                  active={isActive("/admin/chats")}
                  onClick={closeSidebar}
                />
              </div>
            )}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="w-full flex items-center gap-3 px-4 py-4 text-red-300 font-bold hover:bg-white/5 rounded-2xl transition-all group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, active, onClick }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
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
