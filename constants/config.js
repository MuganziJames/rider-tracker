// App configuration constants
export const CONFIG = {
  // Location update interval in milliseconds (7 seconds)
  LOCATION_UPDATE_INTERVAL: 7000,
  
  // ETA update interval in milliseconds (30 seconds)
  ETA_UPDATE_INTERVAL: 30000,
  
  // Map configuration
  MAP_DELTA: {
    latitude: 0.01,
    longitude: 0.01,
  },
  
  // Location accuracy
  LOCATION_ACCURACY: {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
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
