import React, { useState } from 'react';
import Modal from '../common/Modal';
import { deviceService } from '../../services/deviceService';
import { useToast } from '../../context/ToastContext';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

const DeleteDeviceModal = ({ isOpen, onClose, device, onDeviceDeleted }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!device) return;
    setLoading(true);
    try {
      const res = await deviceService.deleteDevice(device._id);
      if (res.success) {
        showToast({
          title: 'Device Removed',
          message: `${device.name} (${device.deviceId}) was deleted from cloud storage.`,
          type: 'success',
        });
        onDeviceDeleted(device._id);
        onClose();
      }
    } catch (err) {
      showToast({
        title: 'Delete Error',
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Cloud De-registration" maxWidth="max-w-md">
      <div className="space-y-4 text-xs sm:text-sm">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-300">Permanent Action</div>
            <div className="text-xs text-rose-200/80 mt-0.5">
              This will permanently delete <span className="font-bold text-white">{device?.name} ({device?.deviceId})</span> and its entire historical telemetry and mission logs from the cloud database.
            </div>
          </div>
        </div>

        <p className="text-slate-300">
          Are you sure you want to remove this autonomous system from AutoCloud?
        </p>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Confirm Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDeviceModal;
