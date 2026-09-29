import React, { useState, useEffect } from 'react';
import {
  Compass,
  PlusCircle,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import MissionCard from '../components/missions/MissionCard';
import CreateMissionModal from '../components/missions/CreateMissionModal';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { missionService } from '../services/missionService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { MISSION_STATUSES, MISSION_PRIORITIES } from '../utils/constants';

const MissionsPage = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const { socket } = useSocket();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchMissions = async () => {
    try {
      const res = await missionService.getMissions({
        status: selectedStatus,
        priority: selectedPriority,
      });
      if (res.success) {
        setMissions(res.missions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [selectedStatus, selectedPriority]);

  // Listen to socket mission updates
  useEffect(() => {
    if (!socket) return;
    const handleMissionUpdate = (updatedMission) => {
      setMissions((prev) =>
        prev.map((m) => (m._id === updatedMission._id ? updatedMission : m))
      );
    };
    socket.on('mission:update', handleMissionUpdate);
    return () => socket.off('mission:update', handleMissionUpdate);
  }, [socket]);

  const handleMissionCreated = (newMission) => {
    setMissions((prev) => [newMission, ...prev]);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await missionService.updateMission(id, { status });
      if (res.success) {
        showToast({
          title: 'Mission Status Updated',
          message: `Mission marked as ${status}`,
          type: 'success',
        });
        setMissions((prev) =>
          prev.map((m) => (m._id === id ? res.mission : m))
        );
      }
    } catch (err) {
      showToast({ title: 'Update Failed', message: err.message, type: 'error' });
    }
  };

  const handleDeleteMission = async (id) => {
    try {
      const res = await missionService.deleteMission(id);
      if (res.success) {
        showToast({
          title: 'Mission Deleted',
          message: 'Task removed from database',
          type: 'success',
        });
        setMissions((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      showToast({ title: 'Delete Failed', message: err.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-cyan-400" /> Mission Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dispatch, coordinate, and track autonomous vehicle missions across distributed zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/25 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Dispatch Mission
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchMissions();
            }}
            className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white"
            title="Refresh Missions"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...MISSION_STATUSES].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === status
                  ? 'bg-cyan-600 text-white shadow-glow-cyan/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Priorities</option>
            {MISSION_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Missions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : missions.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No Autonomous Missions Found"
          description="Create a new mission to assign autonomous routes and navigation tasks."
          actionText="Dispatch New Mission"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {missions.map((mission) => (
            <MissionCard
              key={mission._id}
              mission={mission}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteMission}
            />
          ))}
        </div>
      )}

      {/* Create Mission Modal */}
      <CreateMissionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onMissionCreated={handleMissionCreated}
      />
    </div>
  );
};

export default MissionsPage;
