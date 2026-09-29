const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const simulatorService = require('../services/simulatorService');
const socketService = require('../services/socketService');

// @desc    Get alerts with severity and status filters
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res, next) => {
  try {
    const { status, severity, deviceId } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (severity && severity !== 'All') query.severity = severity;
    if (deviceId && deviceId !== 'All') query.deviceId = deviceId.toUpperCase();

    const alerts = await Alert.find(query).sort({ createdAt: -1 });

    const activeCount = await Alert.countDocuments({ status: 'Active' });
    const criticalCount = await Alert.countDocuments({ status: 'Active', severity: 'Critical' });
    const warningCount = await Alert.countDocuments({ status: 'Active', severity: 'Warning' });

    res.status(200).json({
      success: true,
      count: alerts.length,
      stats: {
        active: activeCount,
        critical: criticalCount,
        warning: warningCount,
      },
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private (Admin/Operator)
const resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.status = 'Resolved';
    alert.resolvedAt = new Date();
    alert.resolvedBy = req.user ? req.user.name : 'Operator';
    alert.resolutionNotes = resolutionNotes || 'Investigated and marked resolved by operator.';

    await alert.save();

    // Broadcast resolution event
    socketService.broadcastAlertResolved(alert);

    res.status(200).json({
      success: true,
      message: `Alert ${alert.alertId} resolved successfully`,
      alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Inject live anomaly for viva demo
// @route   POST /api/alerts/inject
// @access  Private (Admin/Operator)
const injectAnomaly = async (req, res, next) => {
  try {
    const { deviceId, anomalyType } = req.body; // 'LOW_BATTERY', 'OVERHEAT', 'WEAK_SIGNAL', 'OFFLINE', 'RESTORE'

    if (!deviceId || !anomalyType) {
      return res.status(400).json({
        success: false,
        message: 'deviceId and anomalyType are required',
      });
    }

    const result = simulatorService.injectAnomaly(deviceId.toUpperCase(), anomalyType);

    res.status(200).json({
      success: true,
      message: `Anomaly override '${anomalyType}' applied to ${deviceId}`,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear resolved alerts
// @route   DELETE /api/alerts/clear-resolved
// @access  Private (Admin)
const clearResolvedAlerts = async (req, res, next) => {
  try {
    const result = await Alert.deleteMany({ status: 'Resolved' });
    res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} resolved alert records`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  resolveAlert,
  injectAnomaly,
  clearResolvedAlerts,
};
