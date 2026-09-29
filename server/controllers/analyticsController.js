const Device = require('../models/Device');
const Telemetry = require('../models/Telemetry');
const Mission = require('../models/Mission');
const Alert = require('../models/Alert');

// @desc    Get dashboard executive KPI cards & summary
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalSystems = await Device.countDocuments();
    const activeSystems = await Device.countDocuments({ status: { $in: ['Online', 'Warning'] } });
    const offlineSystems = await Device.countDocuments({ status: 'Offline' });
    const criticalSystems = await Device.countDocuments({ status: 'Critical' });
    const warningSystems = await Device.countDocuments({ status: 'Warning' });
    const healthySystems = await Device.countDocuments({ status: 'Online' });

    const criticalAlerts = await Alert.countDocuments({ status: 'Active', severity: 'Critical' });
    const activeMissions = await Mission.countDocuments({ status: 'Active' });
    const completedMissions = await Mission.countDocuments({ status: 'Completed' });
    const pendingMissions = await Mission.countDocuments({ status: 'Pending' });
    const failedMissions = await Mission.countDocuments({ status: { $in: ['Failed', 'Cancelled'] } });

    // Aggregate average telemetry numbers across all current devices
    const deviceStats = await Device.aggregate([
      {
        $group: {
          _id: null,
          avgBattery: { $avg: '$battery' },
          avgTemp: { $avg: '$temperature' },
          avgSpeed: { $avg: '$speed' },
          totalDistance: { $sum: '$distanceTravelled' },
        },
      },
    ]);

    const stats = deviceStats[0] || {
      avgBattery: 0,
      avgTemp: 0,
      avgSpeed: 0,
      totalDistance: 0,
    };

    const totalTelemetryCount = await Telemetry.countDocuments();

    res.status(200).json({
      success: true,
      kpis: {
        totalSystems,
        activeSystems,
        offlineSystems,
        criticalAlerts,
        activeMissions,
        averageBattery: Number(stats.avgBattery.toFixed(1)),
        averageTemperature: Number(stats.avgTemp.toFixed(1)),
        averageSpeed: Number(stats.avgSpeed.toFixed(1)),
        totalDistance: Number(stats.totalDistance.toFixed(2)),
        totalTelemetryRecords: totalTelemetryCount,
      },
      healthDistribution: [
        { name: 'Healthy', value: healthySystems, color: '#10b981' },
        { name: 'Warning', value: warningSystems, color: '#f59e0b' },
        { name: 'Critical', value: criticalSystems, color: '#ef4444' },
        { name: 'Offline', value: offlineSystems, color: '#64748b' },
      ],
      missionStats: {
        completed: completedMissions,
        active: activeMissions,
        pending: pendingMissions,
        failed: failedMissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed analytical trends (battery over time, temp distribution, device activity)
// @route   GET /api/analytics/trends
// @access  Private
const getAnalyticalTrends = async (req, res, next) => {
  try {
    const { timeRange = '7d' } = req.query;

    let timeFilter = new Date();
    if (timeRange === 'today' || timeRange === '24h') {
      timeFilter.setHours(timeFilter.getHours() - 24);
    } else if (timeRange === '30d') {
      timeFilter.setDate(timeFilter.getDate() - 30);
    } else {
      // 7d default
      timeFilter.setDate(timeFilter.getDate() - 7);
    }

    // Sample recent telemetry for trend lines
    const recentTelemetry = await Telemetry.find()
      .sort({ timestamp: -1 })
      .limit(60);

    // Device performance comparison
    const devices = await Device.find().select(
      'name deviceId type battery speed temperature distanceTravelled status signalStrength'
    );

    // Fleet type distribution
    const typeDistribution = await Device.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      timeRange,
      devices,
      typeDistribution,
      recentTelemetry: recentTelemetry.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  getAnalyticalTrends,
};
