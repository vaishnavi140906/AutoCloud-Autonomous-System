import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Lock, Mail, User, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'OPERATOR',
    department: 'Autonomous Fleet Operations',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4 sm:p-6 bg-grid-pattern">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-glow-cyan/40">
              <Cloud className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-white font-mono">
              Auto<span className="text-cyan-400">Cloud</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-white">Create Operator Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Register to join the centralized autonomous systems platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sarah Jenkins"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sarah@autocloud.com"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Platform Role</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="OPERATOR">Operator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Department / Squad</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Autonomous Fleet Operations"
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
