// Calculate distance between two coordinates in kilometers using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(3));
};

// Generate small realistic movement jitter / step along a path
const moveCoordinate = (lat, lng, speedKmH, headingDegrees = 45, secondsElapsed = 3) => {
  const earthRadius = 6378137; // in meters
  const distanceMeters = (speedKmH * 1000 / 3600) * secondsElapsed;
  const headingRad = (headingDegrees * Math.PI) / 180;

  const dLat = (distanceMeters * Math.cos(headingRad)) / earthRadius;
  const dLng =
    (distanceMeters * Math.sin(headingRad)) /
    (earthRadius * Math.cos((lat * Math.PI) / 180));

  const newLat = lat + (dLat * 180) / Math.PI;
  const newLng = lng + (dLng * 180) / Math.PI;

  return {
    latitude: Number(newLat.toFixed(6)),
    longitude: Number(newLng.toFixed(6)),
  };
};

module.exports = { calculateDistance, moveCoordinate };
