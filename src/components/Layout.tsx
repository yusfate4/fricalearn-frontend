import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. The Sidebar handles its own 'fixed' positioning on mobile */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen">
        {/* md:ml-72 matches the width of the sidebar (w-72) */}
        <div className="p-4 pt-16 md:p-8">{children}</div>
      </main>
    </div>
  );
}
