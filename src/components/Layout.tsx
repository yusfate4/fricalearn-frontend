import React from 'react';
import Sidebar from './Sidebar'; // Ensure this matches your file name

// The { children } part is the "secret sauce" that stops the blank page!
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        {children} {/* This renders the Dashboard/Courses/Lessons content */}
      </main>
    </div>
  );
}