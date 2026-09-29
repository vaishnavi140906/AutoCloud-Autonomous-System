import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../utils/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    const res = await demoLogin(role);
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4 sm:p-6 bg-grid-pattern">
      <div className="w-full max-w-4xl glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Cloud & Autonomous Fleet Branding Graphic */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-cyan-950/80 via-slate-900 to-indigo-950/80 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-glow-cyan/40">
                <Cloud className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-mono">
                Auto<span className="text-cyan-400">Cloud</span>
              </span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Autonomous Systems <br />
              <span className="text-cyan-400">Command Center</span>
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Access real-time telemetry streaming, mission tracking, and automated cloud incident detection.
            </p>
          </div>

          {/* Quick 1-Click Demo Section */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> 1-Click Viva Demo Sign In
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 text-left hover:bg-cyan-500/10 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400">
                    Admin Access
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  admin@autocloud.com
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('operator')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/40 hover:border-indigo-400 text-left hover:bg-indigo-500/10 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-400">
                    Operator Access
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  operator@autocloud.com
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Standard Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Sign In to Platform</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter your cloud credentials to authenticate
            </p>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autocloud.com"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
