// Test file for Google Maps API functions
import { getETA, getRoutePolyline } from "./utils/googleMaps.js";

// Test coordinates (Lagos Island to Ikeja)
const origin = "6.5244,3.3792"; // Lagos Island
const destination = "6.6018,3.3515"; // Ikeja

// Test the functions
export const testGoogleMapsAPI = async () => {
  console.log("Testing Google Maps API functions...");

  try {
    // Test ETA function
    console.log("Getting ETA...");
    const eta = await getETA(origin, destination);
    if (eta) {
      console.log(`ETA: ${eta}`);
    } else {
      console.log("Failed to get ETA");
    }

    // Test Route Polyline function
    console.log("Getting route polyline...");
    const polyline = await getRoutePolyline(origin, destination);
    if (polyline) {
      console.log(`Route polyline received (${polyline.length} characters)`);
      console.log("Polyline preview:", polyline.substring(0, 50) + "...");
    } else {
      console.log("Failed to get route polyline");
    }
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Example usage in a React Native component
export const ExampleUsage = () => {
  const handleGetDirections = async () => {
    const userLocation = "6.5244,3.3792"; // User's current location
    const riderLocation = "6.6018,3.3515"; // Rider's location

    // Get ETA
    const eta = await getETA(userLocation, riderLocation);
    if (eta) {
      console.log(`Rider will arrive in: ${eta}`);
      // Update UI with ETA
    } else {
      console.log("Could not calculate ETA - showing fallback");
      // Show fallback text like "ETA unavailable"
    }

    // Get route for mapping
    const polyline = await getRoutePolyline(userLocation, riderLocation);
    if (polyline) {
      console.log("Route polyline ready for map display");
      // Use polyline to draw route on map
    } else {
      console.log("Route not available - using straight line");
      // Show straight line between points as fallback
    }
  };

  return handleGetDirections;
};
