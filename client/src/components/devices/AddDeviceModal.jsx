import React, { useState } from 'react';
import Modal from '../common/Modal';
import { deviceService } from '../../services/deviceService';
import { useToast } from '../../context/ToastContext';
import { DEVICE_TYPES } from '../../utils/constants';
import { PlusCircle, Loader2 } from 'lucide-react';

const AddDeviceModal = ({ isOpen, onClose, onDeviceCreated }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    type: 'Autonomous Robot',
    location: 'Sector 4 - Warehouse Hub',
    manufacturer: 'AutoCloud Dynamics',
    model: 'Fleet-X2',
    battery: 100,
    status: 'Online',
    latitude: 13.0827,
    longitude: 80.2707,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deviceId || !formData.name) {
      showToast({
        title: 'Validation Error',
        message: 'Device ID and Name are required.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await deviceService.createDevice(formData);
      if (res.success) {
        showToast({
          title: 'Device Registered',
          message: `${res.device.name} added to cloud inventory.`,
          type: 'success',
        });
        onDeviceCreated(res.device);
        onClose();
        setFormData({
          deviceId: '',
          name: '',
          type: 'Autonomous Robot',
          location: 'Sector 4 - Warehouse Hub',
          manufacturer: 'AutoCloud Dynamics',
          model: 'Fleet-X2',
          battery: 100,
          status: 'Online',
          latitude: 13.0827,
          longitude: 80.2707,
        });
      }
    } catch (err) {
      showToast({
        title: 'Registration Error',
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Autonomous System" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Device ID <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              placeholder="e.g. ROBO-N9"
              required
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Device Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. CyberBot Explorer"
              required
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Device Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              {DEVICE_TYPES.map((t) => (
                <option key={t} value={t} className="bg-slate-900">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Deployment Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Sector 5 Hub"
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="e.g. AutoCloud Dynamics"
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Model Name</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. Gen-4 AMR"
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Initial Battery (%)</label>
            <input
              type="number"
              name="battery"
              min="1"
              max="100"
              value={formData.battery}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Initial Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Online">Online</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
              <option value="Offline">Offline</option>
            </select>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            Register Device
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDeviceModal;
