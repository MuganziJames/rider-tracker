import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { CONFIG } from "../constants/config";

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("undetermined");
  const [isLoading, setIsLoading] = useState(true);
  const locationSubscription = useRef(null);

  // Request location permissions
  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === "granted") {
        return true;
      } else {
        setError("Location permission was denied");
        return false;
      }
    } catch (err) {
      setError("Failed to request location permissions");
      console.error("Permission request error:", err);
      return false;
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: CONFIG.LOCATION_ACCURACY.timeout,
        maximumAge: CONFIG.LOCATION_ACCURACY.maximumAge,
      });

      setLocation(currentLocation);
      setError(null);
      return currentLocation;
    } catch (err) {
      setError("Failed to get current location");
      console.error("Location fetch error:", err);
      return null;
    }
  };

  // Start watching location changes
  const startLocationTracking = async () => {
    try {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: CONFIG.LOCATION_UPDATE_INTERVAL,
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation);
          setError(null);
        }
      );
    } catch (err) {
      setError("Failed to start location tracking");
      console.error("Location tracking error:", err);
    }
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  // Initialize location services
  useEffect(() => {
    const initializeLocation = async () => {
      setIsLoading(true);

      const hasPermission = await requestPermissions();
      if (hasPermission) {
        await getCurrentLocation();
        await startLocationTracking();
      }

      setIsLoading(false);
    };

    initializeLocation();

    // Cleanup on unmount
    return () => {
      stopLocationTracking();
    };
  }, []);

  return {
    location,
    error,
    permissionStatus,
    isLoading,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
  };
};
