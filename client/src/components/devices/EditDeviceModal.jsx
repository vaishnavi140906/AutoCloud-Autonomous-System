import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { deviceService } from '../../services/deviceService';
import { useToast } from '../../context/ToastContext';
import { DEVICE_TYPES } from '../../utils/constants';
import { Save, Loader2 } from 'lucide-react';

const EditDeviceModal = ({ isOpen, onClose, device, onDeviceUpdated }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Autonomous Robot',
    location: '',
    manufacturer: '',
    model: '',
    status: 'Online',
    battery: 100,
  });

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || '',
        type: device.type || 'Autonomous Robot',
        location: device.location || '',
        manufacturer: device.manufacturer || '',
        model: device.model || '',
        status: device.status || 'Online',
        battery: device.battery || 100,
      });
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await deviceService.updateDevice(device._id, formData);
      if (res.success) {
        showToast({
          title: 'Device Updated',
          message: `${res.device.name} configuration saved.`,
          type: 'success',
        });
        onDeviceUpdated(res.device);
        onClose();
      }
    } catch (err) {
      showToast({
        title: 'Update Error',
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Device: ${device?.deviceId}`} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Device Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          />
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
            <label className="block text-slate-300 font-medium mb-1">Status</label>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Battery (%)</label>
            <input
              type="number"
              name="battery"
              min="0"
              max="100"
              value={formData.battery}
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDeviceModal;
