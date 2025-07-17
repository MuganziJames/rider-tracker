// Development configuration helper
import Constants from "expo-constants";

export const getDevConfig = () => {
  const config = {
    googleMapsApiKey: Constants.expoConfig?.extra?.googleMapsApiKey,
    wsUrl: Constants.expoConfig?.extra?.wsUrl,
    isDevelopment: __DEV__,
  };

  return config;
};

// WebSocket connection helper with better error handling
export const getWebSocketUrl = () => {
  const wsUrl = Constants.expoConfig?.extra?.wsUrl;

  if (!wsUrl || wsUrl.trim() === "" || wsUrl === "ws://your-server-ip:3000") {
    console.warn(
      "⚠️ WebSocket URL not properly configured. WebSocket features will be disabled."
    );
    return null;
  }

  return wsUrl;
};

// Google Maps API validation
export const validateGoogleMapsConfig = () => {
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  if (!apiKey || apiKey.trim() === "") {
    console.error("❌ Google Maps API key not configured");
    return false;
  }

  if (apiKey.includes("your_google_maps_api_key_here")) {
    console.error("❌ Google Maps API key is still using placeholder value");
    return false;
  }

  return true;
};
