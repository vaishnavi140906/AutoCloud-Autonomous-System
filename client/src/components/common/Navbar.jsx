import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Cpu, Activity, ShieldCheck, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b13]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-glow-cyan/50 text-white transition-transform group-hover:scale-105">
              <Cloud className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white font-mono group-hover:text-cyan-400 transition-colors">
                Auto<span className="text-cyan-400">Cloud</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v1.0 Cloud Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/#features" className="hover:text-cyan-400 transition-colors">
              Features
            </Link>
            <Link to="/#architecture" className="hover:text-cyan-400 transition-colors">
              Cloud Architecture
            </Link>
            <Link to="/#technology" className="hover:text-cyan-400 transition-colors">
              Tech Stack
            </Link>
            <Link to="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Viva Guide
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-cyan-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Activity className="w-4 h-4" /> Command Center
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/25 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white border border-slate-800"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-3">
            <Link
              to="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              Features
            </Link>
            <Link
              to="/#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              Cloud Architecture
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              Viva & Project Guide
            </Link>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-cyan-600 rounded-xl"
                  >
                    Open Command Center
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-sm font-semibold text-rose-400 bg-rose-500/10 rounded-xl"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 text-center text-sm font-semibold text-slate-300 border border-slate-800 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-cyan-600 rounded-xl"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
