import React, { useState, useEffect } from 'react';
import {
  Activity,
  Download,
  Filter,
  Search,
  RefreshCw,
  Radio,
  Clock,
  ChevronLeft,
  ChevronRight,
  Code,
  FileSpreadsheet,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { telemetryService } from '../services/telemetryService';
import { deviceService } from '../services/deviceService';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatRelativeTime } from '../utils/formatters';

const TelemetryPage = () => {
  const { showToast } = useToast();
  const { recentTelemetryFeed } = useSocket();

  const [telemetry, setTelemetry] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [selectedDevice, setSelectedDevice] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Raw JSON Inspector Modal
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  // Live Stream Feed Mode
  const [liveStreamActive, setLiveStreamActive] = useState(true);

  const fetchDevices = async () => {
    try {
      const res = await deviceService.getDevices();
      if (res.success) setDevices(res.devices || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTelemetry = async () => {
    try {
      const res = await telemetryService.getHistory({
        deviceId: selectedDevice,
        status: selectedStatus,
        page,
        limit: 20,
      });
      if (res.success) {
        setTelemetry(res.telemetry || []);
        setTotalPages(res.pages || 1);
        setTotalRecords(res.total || 0);
      }
    } catch (err) {
      showToast({ title: 'Error', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    fetchTelemetry();
  }, [selectedDevice, selectedStatus, page]);

  const handleExportCSV = async () => {
    try {
      showToast({
        title: 'Generating CSV Report',
        message: 'Aggregating telemetry rows from MongoDB Atlas...',
        type: 'info',
      });
      const blob = await telemetryService.exportCSV(selectedDevice);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `autocloud-telemetry-${selectedDevice}-${Date.now()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast({
        title: 'Export Complete',
        message: 'Telemetry CSV downloaded successfully.',
        type: 'success',
      });
    } catch (err) {
      showToast({ title: 'Export Failed', message: err.message, type: 'error' });
    }
  };

  const handleInspect = (packet) => {
    setSelectedPacket(packet);
    setInspectModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-cyan-400" /> Cloud Telemetry Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical time-series logs, real-time WebSocket ingestion, and telemetry packet exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchTelemetry();
            }}
            className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Device Selector */}
          <div>
            <select
              value={selectedDevice}
              onChange={(e) => {
                setSelectedDevice(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="All">All Autonomous Nodes</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.name} ({d.deviceId})
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Live Ingestion Stream Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveStreamActive(!liveStreamActive)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              liveStreamActive
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveStreamActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            {liveStreamActive ? 'Live Stream Active' : 'Live Stream Paused'}
          </button>
        </div>
      </div>

      {/* Real-time Streaming Ticker if Live mode is active */}
      {liveStreamActive && recentTelemetryFeed.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">LATEST INGESTION:</span>
            <span className="text-slate-300 font-mono">
              {recentTelemetryFeed[0]?.deviceId} &bull; Battery {recentTelemetryFeed[0]?.battery?.toFixed(1)}% &bull; Speed {recentTelemetryFeed[0]?.speed?.toFixed(1)} km/h &bull; Temp {recentTelemetryFeed[0]?.temperature?.toFixed(1)}°C
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {formatRelativeTime(recentTelemetryFeed[0]?.timestamp)}
          </span>
        </div>
      )}

      {/* Main Historical Table */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : telemetry.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-sm">
          No telemetry records matching the selected parameters.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">TIMESTAMP</th>
                  <th className="py-3.5 px-4 font-semibold">DEVICE ID</th>
                  <th className="py-3.5 px-4 font-semibold">BATTERY</th>
                  <th className="py-3.5 px-4 font-semibold">SPEED</th>
                  <th className="py-3.5 px-4 font-semibold">TEMP</th>
                  <th className="py-3.5 px-4 font-semibold">SIGNAL</th>
                  <th className="py-3.5 px-4 font-semibold">COORDINATES</th>
                  <th className="py-3.5 px-4 font-semibold">DISTANCE</th>
                  <th className="py-3.5 px-4 font-semibold">STATUS</th>
                  <th className="py-3.5 px-4 font-semibold text-right">RAW PACKET</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {telemetry.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400">{formatDate(t.timestamp)}</td>
                    <td className="py-3 px-4 font-bold text-cyan-300">{t.deviceId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {t.battery?.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">{t.speed?.toFixed(1)} km/h</td>
                    <td className="py-3 px-4">{t.temperature?.toFixed(1)}&deg;C</td>
                    <td className="py-3 px-4">{t.signalStrength?.toFixed(0)}%</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {t.latitude?.toFixed(4)}, {t.longitude?.toFixed(4)}
                    </td>
                    <td className="py-3 px-4">{t.distanceTravelled?.toFixed(2)} km</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={t.status || 'Online'} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleInspect(t)}
                        className="p-1 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                        title="View JSON Payload"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing Page <strong className="text-white">{page}</strong> of{' '}
              <strong className="text-white">{totalPages}</strong> ({totalRecords} total entries)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800 text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-700 disabled:opacity-30 hover:bg-slate-800 text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON Packet Inspector Modal */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title="Raw Cloud Telemetry Packet Inspector"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-3">
          <div className="text-xs text-slate-400 font-mono">
            Structured JSON payload ingested by Cloud REST API:
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            {JSON.stringify(selectedPacket, null, 2)}
          </pre>
          <div className="text-right pt-2">
            <button
              onClick={() => setInspectModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TelemetryPage;
