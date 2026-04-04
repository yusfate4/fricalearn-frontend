import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. The Sidebar handles its own 'fixed' positioning on mobile */}
      <Sidebar />

      {/* 2. Main Content Area */}
      {/* md:ml-72: On desktop (medium screens and up), push the content 
  to the right by 72 units (the exact width of our sidebar).
*/}
      <main className="flex-1 md:ml-72 min-h-screen transition-all duration-300">
        <div className="p-4 pt-16 md:p-8 md:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
