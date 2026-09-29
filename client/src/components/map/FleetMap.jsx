import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Bot, Navigation, ExternalLink, Battery, Thermometer, Radio } from 'lucide-react';

// Fix default leaflet marker icon issues in Vite/Webpack bundlers
delete L.Icon.Default.prototype._getIconUrl;

const createCustomMarker = (device) => {
  let color = '#10b981'; // green for online
  if (device.status === 'Critical') color = '#ef4444';
  else if (device.status === 'Warning') color = '#f59e0b';
  else if (device.status === 'Offline') color = '#64748b';

  let iconEmoji = '🤖';
  if (device.type === 'Drone') iconEmoji = '🛸';
  else if (device.type === 'Autonomous Vehicle') iconEmoji = '🚚';
  else if (device.type === 'Industrial Robot') iconEmoji = '⚙️';

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
      <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${color}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: #0f172a; border: 2px solid ${color}; box-shadow: 0 0 12px ${color}80; display: flex; align-items: center; justify-content: center; font-size: 15px;">
        ${iconEmoji}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-fleet-marker',
    html,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

const ChangeMapView = ({ devices }) => {
  const map = useMap();
  useEffect(() => {
    if (devices && devices.length > 0) {
      const validCoords = devices
        .filter((d) => d.latitude && d.longitude)
        .map((d) => [d.latitude, d.longitude]);
      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  }, [devices, map]);
  return null;
};

const FleetMap = ({ devices = [], height = 'h-[480px]', selectedDeviceId = null }) => {
  const defaultCenter = [13.0827, 80.2707]; // Chennai tech corridor default center

  return (
    <div className={`w-full ${height} rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-0`}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <ChangeMapView devices={devices} />

        {devices.map((device) => {
          if (!device.latitude || !device.longitude) return null;
          return (
            <Marker
              key={device._id || device.deviceId}
              position={[device.latitude, device.longitude]}
              icon={createCustomMarker(device)}
            >
              <Popup>
                <div className="p-1 min-w-[200px] text-slate-100 font-sans">
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-700">
                    <div>
                      <div className="font-bold text-sm text-cyan-400">{device.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{device.deviceId}</div>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        device.status === 'Online'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : device.status === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {device.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Battery className="w-3 h-3 text-cyan-400" /> Battery:
                      </span>
                      <span className="font-mono font-semibold">{device.battery?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-indigo-400" /> Speed:
                      </span>
                      <span className="font-mono font-semibold">{device.speed?.toFixed(1)} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-rose-400" /> Temp:
                      </span>
                      <span className="font-mono font-semibold">{device.temperature?.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Radio className="w-3 h-3 text-emerald-400" /> Signal:
                      </span>
                      <span className="font-mono font-semibold">{device.signalStrength?.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700 text-center">
                    <Link
                      to={`/devices/${device._id || device.deviceId}`}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                    >
                      Inspect Live Telemetry <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FleetMap;
