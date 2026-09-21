// src/components/admin/AdminShell.tsx
// Shared sidebar + header for all admin pages
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCheck, MessageSquare,
  BarChart3, CreditCard, History,
  LogOut, Menu, X, Bell, ChevronRight,
  GraduationCap, Trophy,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const NAV = [
  { label: "Dashboard",       path: "/admin",                    icon: LayoutDashboard },
  { label: "Students",        path: "/admin/users",              icon: Users           },
  { label: "Parents",         path: "/admin/parents",            icon: UserCheck       },
  { label: "Support Chat",    path: "/admin/chats",              icon: MessageSquare   },
  { label: "Quiz Builder",    path: "/admin/questions",          icon: MessageSquare      },
  { label: "Analytics",       path: "/admin/analytics",          icon: BarChart3       },
  { label: "Payments",        path: "/admin/payments",           icon: CreditCard      },
  { label: "Pay History",     path: "/admin/payments/history",   icon: History         },
  { label: "Marketplace",     path: "/admin/manage-rewards",     icon: Trophy          },
  { label: "Courses",         path: "/admin/courses",            icon: GraduationCap   },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const NavLink = ({ item }: { item: typeof NAV[0] }) => {
    const Icon  = item.icon;
    const exact = item.path === "/admin";
    const active = exact ? location.pathname === "/admin" : location.pathname.startsWith(item.path) && item.path !== "/admin";
    return (
      <Link to={item.path} onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
          active ? "bg-[#FFFF00] text-[#2A1650]" : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}>
        <Icon size={16} className="shrink-0"/>
        <span>{item.label}</span>
      </Link>
    );
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#2A1650] px-4 py-6">
      <div className="mb-8 px-2">
        <p className="text-2xl font-black text-white">Frica<span className="text-[#FFFF00]">Learn</span></p>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Admin Portal</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV.map(item => <NavLink key={item.path} item={item}/>)}
      </nav>
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 bg-[#FFFF00] rounded-xl flex items-center justify-center text-[#2A1650] font-black text-sm">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-white font-black text-xs truncate">{user?.name || "Admin"}</p>
            <p className="text-white/40 text-[10px] font-bold capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm">
          <LogOut size={16}/> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 fixed inset-y-0 left-0 z-30 shadow-2xl">
        <Sidebar/>
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)}/>
          <aside className="relative w-56 h-full shadow-2xl">
            <Sidebar/>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
              <Menu size={20} className="text-gray-600"/>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-bold text-gray-800">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#3F2171]">
              <Bell size={18}/>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
