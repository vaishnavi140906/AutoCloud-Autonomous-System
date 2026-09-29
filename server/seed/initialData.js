const User = require('../models/User');
const Device = require('../models/Device');
const Telemetry = require('../models/Telemetry');
const Mission = require('../models/Mission');
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');

const seedInitialData = async () => {
  console.log('🌱 Checking / Seeding AutoCloud Initial Database Dataset...');

  // 1. Seed Demo Users
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('👥 Creating Demo Admin & Operator accounts...');
    await User.create([
      {
        name: 'Alex Rivera (Admin)',
        email: 'admin@autocloud.com',
        password: 'Admin@123',
        role: 'ADMIN',
        department: 'Cloud Fleet Engineering',
      },
      {
        name: 'Elena Chen (Operator)',
        email: 'operator@autocloud.com',
        password: 'Operator@123',
        role: 'OPERATOR',
        department: 'Autonomous Mission Control',
      },
    ]);
    console.log('✅ Demo Users Seeded (admin@autocloud.com / Admin@123, operator@autocloud.com / Operator@123)');
  }

  // 2. Check and Seed Devices
  const deviceCount = await Device.countDocuments();
  if (deviceCount === 0) {
    console.log('🤖 Creating 8 Initial Autonomous Systems...');

    const sampleDevices = [
      {
        deviceId: 'ROBO-X1',
        name: 'Robo-Courier Alpha',
        type: 'Autonomous Robot',
        location: 'Warehouse Hub 4 → Gate 3',
        manufacturer: 'AutoCloud Dynamics',
        model: 'CourierBot-v2',
        status: 'Online',
        battery: 84,
        speed: 14.2,
        temperature: 38.5,
        signalStrength: 94,
        latitude: 13.0827,
        longitude: 80.2707,
        altitude: 0,
        distanceTravelled: 142.5,
        currentMission: 'Logistics Transfer Sector 4',
      },
      {
        deviceId: 'DRONE-SKY4',
        name: 'SkyScout Drone X-4',
        type: 'Drone',
        location: 'Air Corridor Gamma (Altitude 45m)',
        manufacturer: 'SkyScout Aero',
        model: 'AeroScan Quad-X',
        status: 'Online',
        battery: 72,
        speed: 52.8,
        temperature: 44.1,
        signalStrength: 88,
        latitude: 13.0910,
        longitude: 80.2815,
        altitude: 45,
        distanceTravelled: 380.2,
        currentMission: 'Perimeter Reconnaissance Orbit',
      },
      {
        deviceId: 'AUTO-V3',
        name: 'CyberHauler EV-7',
        type: 'Autonomous Vehicle',
        location: 'Industrial Perimeter Ring Road',
        manufacturer: 'CyberHaul Tech',
        model: 'EV-Transport 400',
        status: 'Online',
        battery: 65,
        speed: 42.0,
        temperature: 48.2,
        signalStrength: 91,
        latitude: 13.0750,
        longitude: 80.2590,
        altitude: 0,
        distanceTravelled: 620.4,
        currentMission: 'Material Transport Depot B',
      },
      {
        deviceId: 'IND-AGV09',
        name: 'Atlas Heavy AGV-09',
        type: 'Industrial Robot',
        location: 'Manufacturing Plant 2 - Line C',
        manufacturer: 'KukaKinetics',
        model: 'HeavyLift AGV',
        status: 'Online',
        battery: 91,
        speed: 6.5,
        temperature: 32.0,
        signalStrength: 98,
        latitude: 13.0880,
        longitude: 80.2650,
        altitude: 0,
        distanceTravelled: 89.4,
        currentMission: 'Assembly Line Automated Feeding',
      },
      {
        deviceId: 'DRONE-HEX8',
        name: 'AeroScan Hexa-8',
        type: 'Drone',
        location: 'Coastal Port Surveillance',
        manufacturer: 'SkyScout Aero',
        model: 'HexaRotor Patrol-8',
        status: 'Online',
        battery: 58,
        speed: 61.2,
        temperature: 46.8,
        signalStrength: 85,
        latitude: 13.0980,
        longitude: 80.2920,
        altitude: 60,
        distanceTravelled: 495.0,
        currentMission: 'Port Gate Cargo Inspection',
      },
      {
        deviceId: 'ROBO-MED1',
        name: 'MedTransit Micro-1',
        type: 'Autonomous Robot',
        location: 'Medical Campus Corridor A',
        manufacturer: 'AutoCloud Dynamics',
        model: 'MedTransit Micro',
        status: 'Online',
        battery: 96,
        speed: 8.4,
        temperature: 29.5,
        signalStrength: 99,
        latitude: 13.0805,
        longitude: 80.2735,
        altitude: 0,
        distanceTravelled: 64.2,
        currentMission: 'Pharmacy Specimen Dispatch',
      },
      {
        deviceId: 'PATROL-S7',
        name: 'Sentinel Patrol EV',
        type: 'Autonomous Vehicle',
        location: 'North Compound Perimeter',
        manufacturer: 'TitanGuard Robotics',
        model: 'Sentinel Patrol EV',
        status: 'Warning',
        battery: 32,
        speed: 28.0,
        temperature: 63.5,
        signalStrength: 76,
        latitude: 13.0690,
        longitude: 80.2610,
        altitude: 0,
        distanceTravelled: 310.8,
        currentMission: 'Zone 7 Automated Guard Route',
      },
      {
        deviceId: 'AGRI-BOT2',
        name: 'HarvestRover Bio-2',
        type: 'Industrial Robot',
        location: 'Bio-Agricultural South Plot',
        manufacturer: 'BioAuto Systems',
        model: 'HarvestRover 3',
        status: 'Critical',
        battery: 16.5,
        speed: 9.8,
        temperature: 73.2,
        signalStrength: 26,
        latitude: 13.0620,
        longitude: 80.2800,
        altitude: 0,
        distanceTravelled: 178.6,
        currentMission: 'Field Crop Health Mapping',
      },
    ];

    const createdDevices = await Device.insertMany(sampleDevices);
    console.log(`✅ ${createdDevices.length} Autonomous Devices Seeded`);

    // 3. Seed Missions
    console.log('🚀 Creating Initial Autonomous Missions...');
    const sampleMissions = [
      {
        missionName: 'Sector 4 Cargo Dispatch',
        deviceId: 'ROBO-X1',
        source: 'Central Warehouse Dock',
        destination: 'Receiving Gate 3',
        priority: 'High',
        progress: 68,
        status: 'Active',
        startTime: new Date(Date.now() - 25 * 60 * 1000),
        estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000),
      },
      {
        missionName: 'Perimeter Sky Surveillance',
        deviceId: 'DRONE-SKY4',
        source: 'Landing Pad Gamma',
        destination: 'Sector 9 Air Watchpoint',
        priority: 'Critical',
        progress: 42,
        status: 'Active',
        startTime: new Date(Date.now() - 40 * 60 * 1000),
        estimatedCompletion: new Date(Date.now() + 20 * 60 * 1000),
      },
      {
        missionName: 'Industrial Heavy Freight Transfer',
        deviceId: 'AUTO-V3',
        source: 'Depot A Storage',
        destination: 'Terminal B Freight Hub',
        priority: 'Medium',
        progress: 88,
        status: 'Active',
        startTime: new Date(Date.now() - 50 * 60 * 1000),
        estimatedCompletion: new Date(Date.now() + 8 * 60 * 1000),
      },
      {
        missionName: 'Assembly Line Automated Feeding',
        deviceId: 'IND-AGV09',
        source: 'Material Staging Area',
        destination: 'Robotic Welding Cell 4',
        priority: 'High',
        progress: 100,
        status: 'Completed',
        startTime: new Date(Date.now() - 120 * 60 * 1000),
        actualCompletion: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        missionName: 'Harbor Gate Aerial Inspection',
        deviceId: 'DRONE-HEX8',
        source: 'Port Heli-deck',
        destination: 'Container Yard Charlie',
        priority: 'Medium',
        progress: 25,
        status: 'Active',
        startTime: new Date(Date.now() - 10 * 60 * 1000),
        estimatedCompletion: new Date(Date.now() + 35 * 60 * 1000),
      },
      {
        missionName: 'Urgent Lab Sample Delivery',
        deviceId: 'ROBO-MED1',
        source: 'Clinical Pathology Lab',
        destination: 'ICU Clean Room 2',
        priority: 'Critical',
        progress: 100,
        status: 'Completed',
        startTime: new Date(Date.now() - 75 * 60 * 1000),
        actualCompletion: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        missionName: 'Night Perimeter Security Sweep',
        deviceId: 'PATROL-S7',
        source: 'Security Command Station',
        destination: 'South Fencing Zone 7',
        priority: 'Low',
        progress: 54,
        status: 'Active',
        startTime: new Date(Date.now() - 60 * 60 * 1000),
        estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000),
      },
      {
        missionName: 'South Crop Thermal Scans',
        deviceId: 'AGRI-BOT2',
        source: 'Solar Charging Station 2',
        destination: 'Irrigation Sector Beta',
        priority: 'Medium',
        progress: 15,
        status: 'Active',
        startTime: new Date(Date.now() - 15 * 60 * 1000),
        estimatedCompletion: new Date(Date.now() + 45 * 60 * 1000),
      },
    ];

    const createdMissions = await Mission.insertMany(sampleMissions);
    console.log(`✅ ${createdMissions.length} Missions Seeded`);

    // 4. Seed Initial Telemetry History
    console.log('📊 Seeding Initial Historical Telemetry...');
    const telemetryBatch = [];
    const now = Date.now();

    for (const dev of createdDevices) {
      for (let i = 20; i >= 0; i--) {
        const timeOffset = i * 60 * 1000;
        telemetryBatch.push({
          deviceId: dev.deviceId,
          battery: Math.max(10, Math.min(100, dev.battery + (Math.random() * 4 - 2))),
          speed: Math.max(0, dev.speed + (Math.random() * 4 - 2)),
          temperature: Math.max(25, dev.temperature + (Math.random() * 3 - 1.5)),
          latitude: dev.latitude + (Math.random() * 0.004 - 0.002),
          longitude: dev.longitude + (Math.random() * 0.004 - 0.002),
          altitude: dev.altitude || 0,
          signalStrength: Math.max(20, dev.signalStrength + (Math.random() * 6 - 3)),
          distanceTravelled: Math.max(0, dev.distanceTravelled - (i * 0.1)),
          status: dev.status,
          timestamp: new Date(now - timeOffset),
        });
      }
    }
    await Telemetry.insertMany(telemetryBatch);
    console.log(`✅ ${telemetryBatch.length} Telemetry Records Seeded`);

    // 5. Seed Alerts
    console.log('🚨 Seeding Alerts...');
    const sampleAlerts = [
      {
        deviceId: 'AGRI-BOT2',
        alertType: 'LOW_BATTERY',
        severity: 'Critical',
        message: 'CRITICAL: HarvestRover Bio-2 (AGRI-BOT2) battery level dropped to 16.5%. Immediate docking required.',
        status: 'Active',
        createdAt: new Date(Date.now() - 12 * 60 * 1000),
      },
      {
        deviceId: 'AGRI-BOT2',
        alertType: 'HIGH_TEMPERATURE',
        severity: 'Critical',
        message: 'WARNING: HarvestRover Bio-2 core thermal temperature exceeds nominal limits at 73.2°C.',
        status: 'Active',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        deviceId: 'AGRI-BOT2',
        alertType: 'WEAK_SIGNAL',
        severity: 'Warning',
        message: 'WARNING: Low cloud uplink signal on HarvestRover Bio-2 (26%). Packet loss risk.',
        status: 'Active',
        createdAt: new Date(Date.now() - 8 * 60 * 1000),
      },
      {
        deviceId: 'PATROL-S7',
        alertType: 'HIGH_TEMPERATURE',
        severity: 'Warning',
        message: 'WARNING: Sentinel Patrol EV core thermal temperature exceeds nominal limits at 63.5°C.',
        status: 'Active',
        createdAt: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        deviceId: 'DRONE-HEX8',
        alertType: 'WEAK_SIGNAL',
        severity: 'Warning',
        message: 'WARNING: Harbor Gate radio mesh interference detected.',
        status: 'Resolved',
        resolvedAt: new Date(Date.now() - 30 * 60 * 1000),
        resolvedBy: 'Elena Chen (Operator)',
        resolutionNotes: 'Drone re-routed to closer relay tower.',
        createdAt: new Date(Date.now() - 65 * 60 * 1000),
      },
      {
        deviceId: 'ROBO-X1',
        alertType: 'LOW_BATTERY',
        severity: 'Warning',
        message: 'Battery level reached 28% during transit.',
        status: 'Resolved',
        resolvedAt: new Date(Date.now() - 120 * 60 * 1000),
        resolvedBy: 'Alex Rivera (Admin)',
        resolutionNotes: 'Unit docked and charged to 85%.',
        createdAt: new Date(Date.now() - 180 * 60 * 1000),
      },
    ];
    await Alert.insertMany(sampleAlerts);
    console.log(`✅ ${sampleAlerts.length} Sample Alerts Seeded`);

    // 6. Seed Notifications
    const sampleNotifications = [
      {
        title: 'Critical Alert: Low Battery on AGRI-BOT2',
        message: 'Unit is at 16.5% battery and requires immediate cloud-directed dock return.',
        type: 'Alert',
        severity: 'error',
        link: '/alerts',
        read: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        title: 'Mission Dispatched: Sector 4 Cargo Dispatch',
        message: 'Robo-Courier Alpha dispatched on logistics corridor.',
        type: 'Mission',
        severity: 'info',
        link: '/missions',
        read: false,
        createdAt: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        title: 'AutoCloud Platform Online',
        message: 'Cloud Telemetry Ingestion Pipeline and WebSocket Service active.',
        type: 'System',
        severity: 'success',
        link: '/dashboard',
        read: true,
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
    ];
    await Notification.insertMany(sampleNotifications);
    console.log(`✅ Notifications Seeded`);
  }
};

module.exports = { seedInitialData };
