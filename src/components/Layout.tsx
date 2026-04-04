import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. The Sidebar handles its own 'fixed' positioning on mobile */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full min-h-screen overflow-x-hidden">
        {/* 📱 MOBILE PADDING: 
          We add 'pt-20' (top padding) so the Hamburger button in Sidebar.tsx 
          doesn't cover your page titles.
          'md:pt-8' removes that extra space when the sidebar is visible on desktop.
        */}
        <div className="p-4 pt-16 md:p-8 md:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}