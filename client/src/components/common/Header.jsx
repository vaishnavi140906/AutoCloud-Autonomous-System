import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Radio,
  Clock,
  Check,
  Trash2,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSocket } from '../../context/SocketContext';
import { notificationService } from '../../services/notificationService';
import { formatRelativeTime } from '../../utils/formatters';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { isConnected, simulationState } = useSocket();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Real-time clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#070b13]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Mobile menu + Page Title / Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {getGreeting()}, <span className="text-cyan-400 font-bold">{user?.name?.split(' ')[0] || 'Operator'}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-2.5 h-2.5" /> CLOUD FLEET ACTIVE
            </span>
          </div>
          <div className="hidden sm:block text-[11px] text-slate-400 -mt-0.5">
            Cloud Autonomous System Command Center
          </div>
        </div>
      </div>

      {/* Right Section: Simulation Badge, Clock, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3">
        {/* Simulation Mode Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
          </span>
          <span className="font-semibold tracking-wide">SIMULATION MODE: ACTIVE</span>
        </div>

        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Notifications Tray */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-glow-rose">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No new cloud notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.read && handleMarkAsRead(n._id)}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        n.read
                          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                          : 'bg-slate-900/90 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-200">{n.title}</div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  View All Notifications <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-800"
          title="View Profile"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-cyan-500/40 flex items-center justify-center text-white font-bold text-xs uppercase shadow-glow-cyan/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
