// src/components/admin/TutorShell.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Video, HelpCircle,
  BarChart3, LogOut, Menu, UserCircle,
  GraduationCap, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

const NAV = [
  { label: "Dashboard",    path: "/admin",              icon: LayoutDashboard },
  { label: "Courses",      path: "/admin/courses/list", icon: GraduationCap   },
  { label: "Lessons",      path: "/admin/lessons",      icon: BookOpen        },
  { label: "Quizzes",      path: "/admin/questions",    icon: HelpCircle      },
  { label: "Live Classes", path: "/admin/live-classes", icon: Video           },
  { label: "Analytics",    path: "/admin/analytics",    icon: BarChart3       },
  { label: "My Profile",   path: "/tutor/profile",      icon: UserCircle      },
];

export function TutorShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [open, setOpen]           = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [liveClass, setLiveClass] = useState<any>(null);
  const location                  = useLocation();
  const { user, logout }          = useAuth();

  // Fetch upcoming/live classes — same pattern as student Sidebar
  useEffect(() => {
    api.get("/live-classes")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setLiveClass(res.data[0]);
        }
      })
      .catch(() => {});
  }, [location]);

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const closeSidebar = () => setOpen(false);

  // ── Reusable nav link — same style as student SidebarLink ────────
  function NavLink({ item }: { item: typeof NAV[0] }) {
    const Icon    = item.icon;
    const active  = isActive(item.path);
    return (
      <Link to={item.path} onClick={closeSidebar}
        className={`flex items-center gap-3 rounded-[1.2rem] font-bold transition-all group
          ${active ? "bg-white/15 text-white shadow-lg" : "text-white/50 hover:text-white hover:bg-white/5"}
          ${collapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3.5"}`}>
        <span className={`${active ? "text-inherit" : "text-white/40 group-hover:text-white"} transition-colors`}>
          <Icon size={20} />
        </span>
        {!collapsed && <span className="text-[13px] tracking-tight">{item.label}</span>}
      </Link>
    );
  }

  // ── Highlighted Join Class link — identical to student sidebar ───
  function JoinClassLink() {
    if (!liveClass) return null;
    const href = liveClass.meeting_url || `/live-room/${liveClass.id}`;
    const isExt = !!liveClass.meeting_url;
    const cls = `flex items-center gap-3 rounded-[1.2rem] font-bold transition-all
      bg-[#FFFF00]/20 text-yellow-400 border border-[#FFFF00]/30 hover:bg-[#FFFF00]/30
      ${collapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3.5"}`;

    return isExt ? (
      <a href={href} target="_blank" rel="noreferrer" onClick={closeSidebar} className={cls} title={collapsed ? "Join Class" : ""}>
        <Video size={20} className="animate-pulse shrink-0" />
        {!collapsed && <span className="text-[13px] tracking-tight font-black">Join Class</span>}
      </a>
    ) : (
      <Link to={href} onClick={closeSidebar} className={cls} title={collapsed ? "Join Class" : ""}>
        <Video size={20} className="animate-pulse shrink-0" />
        {!collapsed && <span className="text-[13px] tracking-tight font-black">Join Class</span>}
      </Link>
    );
  }

  function SectionHeader({ label }: { label: string }) {
    if (collapsed) return <div className="h-px bg-white/10 my-4 mx-2" />;
    return <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] mb-2 mt-4 text-[#FFFF00]">{label}</p>;
  }

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full bg-[#3F2171] text-white shadow-2xl">
        <div className={`flex items-center mb-8 pt-6 ${collapsed ? "justify-center px-4" : "justify-between px-6"}`}>
          {!collapsed && (
            <div>
              <h2 className="text-2xl font-black text-[#FFFF00] tracking-tighter uppercase italic leading-none">FricaLearn</h2>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">Tutor Portal</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-2 text-white/60 bg-white/10 rounded-xl hover:bg-white/20">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button onClick={closeSidebar} className="md:hidden p-2 text-white/60 bg-white/10 rounded-xl">
            ✕
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto no-scrollbar pb-6 ${collapsed ? "px-2" : "px-4"}`}>
          <nav className="space-y-1">
            <SectionHeader label="Tutor Menu" />

            {/* Join Class appears first — same as student sidebar */}
            <JoinClassLink />

            <NavLink item={{ label: "Dashboard", path: "/admin", icon: LayoutDashboard }} />
            <NavLink item={{ label: "Live Classes", path: "/admin/live-classes", icon: Video }} />
            <NavLink item={{ label: "Courses", path: "/admin/courses/list", icon: GraduationCap }} />
            <NavLink item={{ label: "Lessons", path: "/admin/lessons", icon: BookOpen }} />
            <NavLink item={{ label: "Quizzes", path: "/admin/questions", icon: HelpCircle }} />
            <NavLink item={{ label: "Analytics", path: "/admin/analytics", icon: BarChart3 }} />
            <NavLink item={{ label: "My Profile", path: "/tutor/profile", icon: UserCircle }} />
          </nav>
        </div>

        <div className={`pt-4 border-t border-white/10 mt-auto ${collapsed ? "flex justify-center px-2 pb-4" : "px-4 pb-6"}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 mb-3">
              <div className="w-8 h-8 bg-[#FFFF00] rounded-xl flex items-center justify-center text-[#2A1650] font-black text-sm shrink-0">
                {(user?.name?.[0] ?? "T").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-black text-xs truncate">{user?.name ?? "Tutor"}</p>
                <p className="text-white/40 text-[10px] font-bold capitalize">Tutor</p>
              </div>
            </div>
          )}
          <button onClick={() => { localStorage.clear(); logout(); closeSidebar(); }}
            title="Logout"
            className={`flex items-center gap-3 text-red-300 font-bold hover:bg-red-500/10 rounded-[1.5rem] transition-all group
              ${collapsed ? "p-4" : "w-full px-5 py-4"}`}>
            <LogOut size={20} />
            {!collapsed && <span className="text-sm uppercase tracking-widest font-black italic">Logout</span>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(true)}
        className={`md:hidden fixed top-4 left-4 z-[60] p-3 bg-[#3F2171] text-white rounded-2xl shadow-xl transition-all ${open ? "opacity-0" : "opacity-100"}`}>
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-[70] backdrop-blur-[2px]" onClick={closeSidebar} />
      )}
      {open && (
        <aside className="md:hidden fixed top-0 bottom-0 left-0 z-[80] w-72">
          <SidebarContent />
        </aside>
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-gray-100">
              <Menu size={20} className="text-gray-600" />
            </button>
            <span className="font-bold text-gray-800">{title}</span>
          </div>
          {/* Compact join button in header on mobile when class is live */}
          {liveClass && (
            <a href={liveClass.meeting_url || `/live-room/${liveClass.id}`}
              target={liveClass.meeting_url ? "_blank" : "_self"} rel="noreferrer"
              className="flex items-center gap-2 bg-[#3F2171] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
              <Video size={13} className="animate-pulse" /> Join Class
            </a>
          )}
        </header>
        <main className="flex-1 px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
