import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center font-bold text-xs font-mono text-cyan-400">
            AC
          </div>
        </div>
        <p className="mt-4 text-xs font-mono tracking-widest text-slate-400 uppercase">
          Initializing Cloud Command Center...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070b13] flex bg-grid-pattern text-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
