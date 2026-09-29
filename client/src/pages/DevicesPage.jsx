import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  PlusCircle,
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronRight,
  ExternalLink,
  Battery,
  Navigation,
  Thermometer,
  Radio,
} from 'lucide-react';
import DeviceCard from '../components/devices/DeviceCard';
import AddDeviceModal from '../components/devices/AddDeviceModal';
import EditDeviceModal from '../components/devices/EditDeviceModal';
import DeleteDeviceModal from '../components/devices/DeleteDeviceModal';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { deviceService } from '../services/deviceService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { DEVICE_TYPES, DEVICE_STATUSES } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';

const DevicesPage = () => {
  const { isAdmin } = useAuth();
  const { liveTelemetry } = useSocket();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & View State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeDevice, setActiveDevice] = useState(null);

  const fetchDevices = async () => {
    try {
      const res = await deviceService.getDevices({
        search,
        type: selectedType,
        status: selectedStatus,
      });
      if (res.success) {
        setDevices(res.devices || []);
      }
    } catch (err) {
      console.error('Failed to load devices:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [search, selectedType, selectedStatus]);

  const handleDeviceCreated = (newDev) => {
    setDevices((prev) => [newDev, ...prev]);
  };

  const handleDeviceUpdated = (updatedDev) => {
    setDevices((prev) =>
      prev.map((d) => (d._id === updatedDev._id ? updatedDev : d))
    );
  };

  const handleDeviceDeleted = (deletedId) => {
    setDevices((prev) => prev.filter((d) => d._id !== deletedId));
  };

  const handleEditClick = (dev) => {
    setActiveDevice(dev);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (dev) => {
    setActiveDevice(dev);
    setDeleteModalOpen(true);
  };

  // Merge live telemetry readings into devices
  const renderedDevices = devices.map((d) => {
    const live = liveTelemetry[d.deviceId];
    if (live) {
      return {
        ...d,
        battery: live.battery !== undefined ? live.battery : d.battery,
        speed: live.speed !== undefined ? live.speed : d.speed,
        temperature: live.temperature !== undefined ? live.temperature : d.temperature,
        signalStrength: live.signalStrength !== undefined ? live.signalStrength : d.signalStrength,
        status: live.status || d.status,
        lastCommunication: live.timestamp || d.lastCommunication,
      };
    }
    return d;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-cyan-400" /> Autonomous Systems Fleet
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage, configure, and monitor your cloud-connected autonomous machines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Register System
            </button>
          )}

          <button
            onClick={() => {
              setRefreshing(true);
              fetchDevices();
            }}
            className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white"
            title="Refresh Systems"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search, Filters, and View Switcher Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, sector..."
            className="w-full pl-10 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Vehicle Types</option>
            {DEVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Health Statuses</option>
            {DEVICE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Grid / Table View Mode Switch */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : renderedDevices.length === 0 ? (
        <EmptyState
          title="No Autonomous Systems Found"
          description="Try adjusting your search criteria or register a new autonomous node."
          actionText={isAdmin ? 'Register System' : null}
          onAction={() => setAddModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {renderedDevices.map((device) => (
            <DeviceCard
              key={device._id || device.deviceId}
              device={device}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">DEVICE</th>
                  <th className="py-3.5 px-4 font-semibold">TYPE</th>
                  <th className="py-3.5 px-4 font-semibold">LOCATION</th>
                  <th className="py-3.5 px-4 font-semibold">STATUS</th>
                  <th className="py-3.5 px-4 font-semibold">BATTERY</th>
                  <th className="py-3.5 px-4 font-semibold">SPEED</th>
                  <th className="py-3.5 px-4 font-semibold">TEMP</th>
                  <th className="py-3.5 px-4 font-semibold">SIGNAL</th>
                  <th className="py-3.5 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {renderedDevices.map((device) => (
                  <tr
                    key={device._id || device.deviceId}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{device.name}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{device.deviceId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{device.type}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[160px] truncate">
                      {device.location}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={device.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {device.battery?.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {device.speed?.toFixed(1)} km/h
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {device.temperature?.toFixed(1)}&deg;C
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {device.signalStrength?.toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/devices/${device._id || device.deviceId}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEditClick(device)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(device)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddDeviceModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onDeviceCreated={handleDeviceCreated}
      />

      <EditDeviceModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        device={activeDevice}
        onDeviceUpdated={handleDeviceUpdated}
      />

      <DeleteDeviceModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        device={activeDevice}
        onDeviceDeleted={handleDeviceDeleted}
      />
    </div>
  );
};

export default DevicesPage;
