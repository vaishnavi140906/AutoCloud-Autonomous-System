import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Compass,
  Bot,
  Shield,
  Trash2,
  Check,
  ExternalLink,
} from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import { Link } from 'react-router-dom';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'Alert':
      return AlertTriangle;
    case 'Mission':
      return Compass;
    case 'Device':
      return Bot;
    default:
      return Bell;
  }
};

const NotificationsPage = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread' | 'Alert' | 'Mission'

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast({ title: 'Success', message: 'All notifications marked as read', type: 'success' });
    } catch (err) {
      showToast({ title: 'Error', message: err.message, type: 'error' });
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearNotifications();
      setNotifications([]);
      showToast({ title: 'Cleared', message: 'Notification tray cleared', type: 'success' });
    } catch (err) {
      showToast({ title: 'Error', message: err.message, type: 'error' });
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'Alert') return n.type === 'Alert';
    if (filter === 'Mission') return n.type === 'Mission';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-cyan-400" /> Cloud Notification Tray
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized feed for fleet incidents, mission dispatches, and system updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Mark All Read
          </button>

          <button
            onClick={handleClearAll}
            className="p-2 rounded-xl glass-panel border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear Tray"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Unread', 'Alert', 'Mission'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-cyan-600 text-white shadow-glow-cyan/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Notification Tray Empty"
          description="You are caught up on all autonomous system and cloud platform events."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = getNotificationIcon(item.type);
            return (
              <div
                key={item._id}
                onClick={() => !item.read && handleMarkAsRead(item._id)}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 cursor-pointer ${
                  item.read
                    ? 'glass-panel border-slate-800/80 opacity-70'
                    : 'glass-panel border-cyan-500/40 bg-slate-900/90 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      item.severity === 'error'
                        ? 'bg-rose-500/20 text-rose-400'
                        : item.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    {item.link && (
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold mt-2"
                      >
                        Inspect Resource <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
