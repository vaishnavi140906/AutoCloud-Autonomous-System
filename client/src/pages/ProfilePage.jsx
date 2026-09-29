import React, { useState } from 'react';
import {
  User,
  Shield,
  Mail,
  Lock,
  Building,
  Save,
  KeyRound,
  CheckCircle2,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    await updateProfile({ name, department });
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast({ title: 'Mismatch', message: 'New passwords do not match', type: 'error' });
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.success) {
        showToast({ title: 'Success', message: 'Password updated successfully', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showToast({ title: 'Error', message: err.message, type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-cyan-400" /> Account & Operator Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your credentials, role privileges, and system operator profile.
        </p>
      </div>

      {/* User Info Overview Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 border-2 border-cyan-500/40 flex items-center justify-center text-white font-black text-2xl uppercase shadow-glow-cyan/40">
          {user?.name?.charAt(0) || 'U'}
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
              {user?.role || 'OPERATOR'}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> {user?.email}
            </span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-500" /> {user?.department}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Member since {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Update Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" /> Personal Details
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Department / Operations Squad</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-2.5 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center gap-2"
            >
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400" /> Security & Password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
