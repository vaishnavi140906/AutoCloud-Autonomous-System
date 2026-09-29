import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft, CloudOff } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-6 bg-grid-pattern text-center">
      <div className="max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <CloudOff className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-white font-mono">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Sector Coordinates Not Found</h2>
        <p className="text-xs text-slate-400">
          The autonomous system resource or cloud route you requested does not exist on this gateway.
        </p>

        <div className="pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Command Center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
