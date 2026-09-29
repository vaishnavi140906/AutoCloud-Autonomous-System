import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { missionService } from '../../services/missionService';
import { deviceService } from '../../services/deviceService';
import { useToast } from '../../context/ToastContext';
import { MISSION_PRIORITIES } from '../../utils/constants';
import { Compass, Loader2 } from 'lucide-react';

const CreateMissionModal = ({ isOpen, onClose, onMissionCreated }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    missionName: '',
    deviceId: '',
    source: 'Central Depot Alpha',
    destination: 'Sector 9 Terminal',
    priority: 'Medium',
    estimatedMinutes: 30,
    payloadWeight: 5,
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      deviceService.getDevices().then((res) => {
        if (res.success && res.devices.length > 0) {
          setDevices(res.devices);
          setFormData((prev) => ({
            ...prev,
            deviceId: prev.deviceId || res.devices[0].deviceId,
          }));
        }
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.missionName || !formData.deviceId || !formData.source || !formData.destination) {
      showToast({
        title: 'Validation Error',
        message: 'Please complete all mission fields.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await missionService.createMission(formData);
      if (res.success) {
        showToast({
          title: 'Mission Dispatched',
          message: `Mission "${res.mission.missionName}" assigned to ${res.mission.deviceId}.`,
          type: 'success',
        });
        onMissionCreated(res.mission);
        onClose();
        setFormData({
          missionName: '',
          deviceId: devices[0]?.deviceId || '',
          source: 'Central Depot Alpha',
          destination: 'Sector 9 Terminal',
          priority: 'Medium',
          estimatedMinutes: 30,
          payloadWeight: 5,
          description: '',
        });
      }
    } catch (err) {
      showToast({
        title: 'Dispatch Failed',
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch Autonomous Mission" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-slate-300 font-medium mb-1">
            Mission Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="missionName"
            value={formData.missionName}
            onChange={handleChange}
            placeholder="e.g. Hazardous Sector Inspection"
            required
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Assign Autonomous Unit <span className="text-rose-400">*</span>
            </label>
            <select
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId} className="bg-slate-900">
                  {d.name} ({d.deviceId}) &bull; {d.battery}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              {MISSION_PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-slate-900">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Origin / Departure Point</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="e.g. Dock 4"
              required
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Destination Target</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. Gate 8 Receiving"
              required
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Estimated Duration (Mins)</label>
            <input
              type="number"
              name="estimatedMinutes"
              min="5"
              max="600"
              value={formData.estimatedMinutes}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Payload Weight (kg)</label>
            <input
              type="number"
              name="payloadWeight"
              min="0"
              step="0.5"
              value={formData.payloadWeight}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
            Dispatch Mission
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateMissionModal;
