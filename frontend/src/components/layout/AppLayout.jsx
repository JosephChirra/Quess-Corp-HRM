import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1">
          <div className="px-6 py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
