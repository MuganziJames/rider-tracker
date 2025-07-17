// App configuration constants
export const CONFIG = {
  // Location update interval in milliseconds (7 seconds)
  LOCATION_UPDATE_INTERVAL: 7000,

  // ETA update interval in milliseconds (120 seconds - increased to reduce API calls)
  ETA_UPDATE_INTERVAL: 120000,

  // Minimum distance (in km) to trigger a new route calculation
  MIN_DISTANCE_FOR_ROUTE_UPDATE: 0.1, // 100 meters

  // Map configuration
  MAP_DELTA: {
    latitude: 0.01,
    longitude: 0.01,
  },

  // Location accuracy
  LOCATION_ACCURACY: {
    enableHighAccuracy: true,
    timeout: 15000, // Reduced from 20000 for faster initial fix
    maximumAge: 1000,
    accuracyThreshold: 20, // Maximum accuracy in meters to consider a location "good"
  },

  // WebSocket reconnection settings
  WEBSOCKET_RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
};

// Dummy destination for testing (Lagos, Nigeria)
export const DUMMY_DESTINATION = {
  latitude: 6.5244,
  longitude: 3.3792,
  name: "Lagos Island Delivery Point",
};
