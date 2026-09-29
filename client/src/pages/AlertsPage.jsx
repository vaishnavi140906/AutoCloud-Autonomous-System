import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Flame,
  Check,
  Trash2,
  ShieldAlert,
  Info,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import AnomalyInjectorModal from '../components/alerts/AnomalyInjectorModal';
import EmptyState from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { alertService } from '../services/alertService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatRelativeTime } from '../utils/formatters';

const AlertsPage = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const { socket } = useSocket();

  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ active: 0, critical: 0, warning: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  // Modals
  const [injectorOpen, setInjectorOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await alertService.getAlerts({
        status: selectedStatus,
        severity: selectedSeverity,
      });
      if (res.success) {
        setAlerts(res.alerts || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [selectedStatus, selectedSeverity]);

  // Real-time socket alert listener
  useEffect(() => {
    if (!socket) return;
    const handleNewAlert = (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      setStats((prev) => ({
        ...prev,
        active: prev.active + 1,
        critical: newAlert.severity === 'Critical' ? prev.critical + 1 : prev.critical,
        warning: newAlert.severity === 'Warning' ? prev.warning + 1 : prev.warning,
      }));
    };

    const handleResolved = (resolvedAlert) => {
      setAlerts((prev) =>
        prev.map((a) => (a._id === resolvedAlert._id ? resolvedAlert : a))
      );
    };

    socket.on('alert:new', handleNewAlert);
    socket.on('alert:resolved', handleResolved);

    return () => {
      socket.off('alert:new', handleNewAlert);
      socket.off('alert:resolved', handleResolved);
    };
  }, [socket]);

  const openResolveDialog = (alert) => {
    setSelectedAlert(alert);
    setResolutionNotes('Anomaly evaluated. Parameter restored to nominal limits.');
    setResolveModalOpen(true);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlert) return;
    setResolving(true);
    try {
      const res = await alertService.resolveAlert(selectedAlert._id, resolutionNotes);
      if (res.success) {
        showToast({
          title: 'Alert Resolved',
          message: `Incident ${selectedAlert.alertId} has been resolved.`,
          type: 'success',
        });
        setAlerts((prev) =>
          prev.map((a) => (a._id === selectedAlert._id ? res.alert : a))
        );
        setResolveModalOpen(false);
      }
    } catch (err) {
      showToast({ title: 'Resolution Failed', message: err.message, type: 'error' });
    } finally {
      setResolving(false);
    }
  };

  const handleClearResolved = async () => {
    try {
      const res = await alertService.clearResolved();
      if (res.success) {
        showToast({ title: 'Cleaned Up', message: res.message, type: 'success' });
        fetchAlerts();
      }
    } catch (err) {
      showToast({ title: 'Purge Failed', message: err.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-7 h-7 text-rose-500" /> Incident & Alert Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time anomaly detection, thermal over-limit warnings, battery drops, and resolution logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setInjectorOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-xl transition-all shadow-md"
          >
            <Flame className="w-4 h-4 text-amber-400" /> Viva Test Anomaly
          </button>

          {isAdmin && (
            <button
              onClick={handleClearResolved}
              className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-400 hover:text-rose-400"
              title="Purge Resolved Incidents"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              setRefreshing(true);
              fetchAlerts();
            }}
            className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white"
            title="Refresh Alerts"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Active Incidents
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {stats.active}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
              Critical Alarms
            </span>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {stats.critical}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              Warning Alerts
            </span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {stats.warning}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Active', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-cyan-600 text-white shadow-glow-cyan/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st} Status
            </button>
          ))}
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="Warning">Warning Only</option>
            <option value="Info">Info Only</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed / Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="All Systems Operating Nominally"
          description="No active anomalies detected by the cloud evaluation engine."
          actionText="Inject Test Anomaly"
          onAction={() => setInjectorOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';
            const isResolved = alert.status === 'Resolved';

            return (
              <div
                key={alert._id}
                className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isResolved
                    ? 'border-slate-800/80 bg-slate-900/40 opacity-70'
                    : isCritical
                    ? 'border-rose-500/50 bg-rose-950/20 shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]'
                    : 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                      isResolved
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : isCritical
                        ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {isResolved ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isCritical ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">
                        {alert.deviceId}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          isResolved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isCritical
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {alert.severity} &bull; {alert.alertType}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatRelativeTime(alert.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      {alert.message}
                    </p>

                    {isResolved && (
                      <div className="text-[11px] text-emerald-400/90 font-mono mt-1 flex items-center gap-1.5">
                        <Check className="w-3 h-3" /> Resolved by {alert.resolvedBy || 'Operator'}{' '}
                        ({formatDate(alert.resolvedAt)})
                      </div>
                    )}
                  </div>
                </div>

                {/* Resolve Action */}
                {!isResolved && (
                  <button
                    onClick={() => openResolveDialog(alert)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 rounded-xl transition-all shrink-0 ml-auto md:ml-0"
                  >
                    <Check className="w-3.5 h-3.5" /> Resolve Alert
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolution Dialog Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Anomaly Incident"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <div className="text-slate-300 mb-1 font-semibold">Incident Target:</div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
              {selectedAlert?.deviceId} &bull; {selectedAlert?.alertType}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Operator Resolution Log:
            </label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resolving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md"
            >
              {resolving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Mark Resolved
            </button>
          </div>
        </form>
      </Modal>

      {/* Anomaly Injector Modal */}
      <AnomalyInjectorModal
        isOpen={injectorOpen}
        onClose={() => setInjectorOpen(false)}
        onInjected={fetchAlerts}
      />
    </div>
  );
};

export default AlertsPage;
