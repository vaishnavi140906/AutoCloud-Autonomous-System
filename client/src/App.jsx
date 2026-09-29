import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import TelemetryPage from './pages/TelemetryPage';
import MissionsPage from './pages/MissionsPage';
import AlertsPage from './pages/AlertsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FleetMapPage from './pages/FleetMapPage';
import NotificationsPage from './pages/NotificationsPage';
import CloudArchitecturePage from './pages/CloudArchitecturePage';
import AboutProjectPage from './pages/AboutProjectPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/architecture-public" element={<CloudArchitecturePage />} />
        <Route path="/about-public" element={<AboutProjectPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Command Center Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/devices/:id" element={<DeviceDetailPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/telemetry" element={<TelemetryPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/map" element={<FleetMapPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/architecture" element={<CloudArchitecturePage />} />
        <Route path="/about" element={<AboutProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
