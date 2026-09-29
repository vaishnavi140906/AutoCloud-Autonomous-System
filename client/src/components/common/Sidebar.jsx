import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Compass,
  Activity,
  AlertTriangle,
  BarChart3,
  MapPin,
  Bell,
  Cloud,
  HelpCircle,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const navigationItems = [
  { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Autonomous Systems', path: '/devices', icon: Bot },
  { name: 'Mission Control', path: '/missions', icon: Compass },
  { name: 'Telemetry Stream', path: '/telemetry', icon: Activity },
  { name: 'Alerts Center', path: '/alerts', icon: AlertTriangle },
  { name: 'Cloud Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Fleet Radar Map', path: '/map', icon: MapPin },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Cloud Architecture', path: '/architecture', icon: Cloud },
  { name: 'Viva / Project Guide', path: '/about', icon: HelpCircle },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings & Sim Engine', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isConnected, simulationState } = useSocket();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#070b13] border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-glow-cyan/40">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider text-white font-mono">
                Auto<span className="text-cyan-400">Cloud</span>
              </span>
              <div className="text-[10px] text-slate-400 font-medium -mt-1 tracking-tight">
                Autonomous Cloud Platform
              </div>
            </div>
          </Link>
        </div>

        {/* Live System Status Pill */}
        <div className="px-4 pt-3 pb-1">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                ></span>
              </span>
              <span className="text-slate-300 font-medium">
                {isConnected ? 'Cloud WebSocket Live' : 'Reconnecting...'}
              </span>
            </div>
            {simulationState.isActive && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                SIM
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024 && onClose) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Operator'}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Shield className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="uppercase font-mono tracking-wider font-semibold text-cyan-400">
                    {user?.role || 'OPERATOR'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
