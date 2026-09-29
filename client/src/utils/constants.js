export const APP_NAME = 'AutoCloud';
export const APP_TAGLINE = 'Cloud-Based Autonomous System Management Platform';

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@autocloud.com',
    password: 'Admin@123',
    role: 'ADMIN',
  },
  operator: {
    email: 'operator@autocloud.com',
    password: 'Operator@123',
    role: 'OPERATOR',
  },
};

export const DEVICE_TYPES = [
  'Autonomous Robot',
  'Drone',
  'Autonomous Vehicle',
  'Industrial Robot',
];

export const DEVICE_STATUSES = ['Online', 'Warning', 'Critical', 'Offline'];

export const MISSION_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const MISSION_STATUSES = [
  'Pending',
  'Active',
  'Completed',
  'Failed',
  'Cancelled',
];

export const ALERT_SEVERITIES = ['Info', 'Warning', 'Critical'];
