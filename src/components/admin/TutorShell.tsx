// src/components/admin/TutorShell.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Video, HelpCircle,
  BarChart3, LogOut, Menu, UserCircle,
  GraduationCap, Radio,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const NAV = [
  { label: "Dashboard",    path: "/admin",                icon: LayoutDashboard },
  { label: "Courses",      path: "/admin/courses/list",   icon: GraduationCap   },
  { label: "Lessons",      path: "/admin/lessons",        icon: BookOpen        },
  { label: "Quizzes",      path: "/admin/questions",      icon: HelpCircle      },
  { label: "Live Classes", path: "/admin/live-classes",   icon: Video           },
  { label: "Analytics",    path: "/admin/analytics",      icon: BarChart3       },
  { label: "My Profile",   path: "/tutor/profile",        icon: UserCircle      },
];

interface Props {
  children: React.ReactNode;
  title: string;
  liveClass: any | null; // pass the active live class object if one is happening now
}

export function TutorShell({ children, title, liveClass }: Props) {
  const [open, setOpen]  = useState(false);
  const location         = useLocation();
  const { user, logout } = useAuth();

  function NavItem({ item }: { item: typeof NAV[0] }) {
    const Icon   = item.icon;
    const exact  = item.path === "/admin";
    const active = exact
      ? location.pathname === "/admin"
      : location.pathname.startsWith(item.path);
    return (
      <Link to={item.path} onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
          active ? "bg-[#FFFF00] text-[#2A1650]" : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}>
        <Icon size={16} className="shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  }

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full bg-[#2A1650] px-3 py-6">

        {/* Logo */}
        <div className="mb-6 px-2">
          <p className="text-xl font-black text-white">
            Frica<span className="text-[#FFFF00]">Learn</span>
          </p>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">
            Tutor Portal
          </p>
        </div>

        {/* ── JOIN CLASS BUTTON — shown in sidebar when a class is live ── */}
        {liveClass && (
          <a href={liveClass.meeting_url || "#"} target="_blank" rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 bg-[#FFFF00] text-[#2A1650] px-3 py-3.5 rounded-xl font-black text-sm mb-4 hover:bg-white transition-all animate-pulse hover:animate-none">
            <Radio size={18} className="shrink-0" />
            <div className="min-w-0">
              <p className="font-black text-[11px] uppercase tracking-widest leading-tight">
                Class is Live!
              </p>
              <p className="text-[9px] font-bold truncate opacity-70">{liveClass.title}</p>
            </div>
            <span className="ml-auto font-black text-[10px]">→</span>
          </a>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto space-y-0.5">
          {NAV.map(item => <NavItem key={item.path} item={item} />)}
        </nav>

        {/* User + logout */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 bg-[#FFFF00] rounded-xl flex items-center justify-center text-[#2A1650] font-black text-sm shrink-0">
              {(user?.name?.[0] ?? "T").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-xs truncate">{user?.name ?? "Tutor"}</p>
              <p className="text-white/40 text-[10px] font-bold">Tutor</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 fixed inset-y-0 left-0 z-30 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-52 h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-52 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
              <Menu size={20} className="text-gray-600" />
            </button>
            <span className="font-bold text-gray-800">{title}</span>
          </div>

          {/* ── JOIN CLASS BUTTON in top bar on mobile ── */}
          {liveClass && (
            <a href={liveClass.meeting_url || "#"} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 bg-[#3F2171] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all animate-pulse hover:animate-none">
              <Radio size={13} />
              <span className="hidden sm:block">Class is Live —</span> Join Now
            </a>
          )}

          {!liveClass && (
            <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
              Tutor Access
            </span>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
