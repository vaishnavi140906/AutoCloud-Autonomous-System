import React from 'react';
import { Cloud, Cpu, Server, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070b13] py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-mono">
              Auto<span className="text-cyan-400">Cloud</span>
            </div>
            <div className="text-xs text-slate-400">
              Cloud-Based Autonomous System Management Platform
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Server className="w-3.5 h-3.5 text-indigo-400" /> Node.js & Express REST API
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Cloud className="w-3.5 h-3.5 text-emerald-400" /> MongoDB Atlas Cloud DB
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Real-time Socket.IO Stream
          </span>
        </div>

        <div className="text-xs text-slate-400 text-center md:text-right">
          <div>College Cloud Computing Project &bull; Academic Viva Ready</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Simulated Telemetry Engine &bull; Zero Hardware Dependency
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
