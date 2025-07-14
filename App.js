import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Constants from "expo-constants";

// Custom hooks
import { useLocation } from "./hooks/useLocation";
import { useWebSocket } from "./hooks/useWebSocket";

// Components
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import StatusPanel from "./components/StatusPanel";

// Utils and constants
import {
  calculateETA,
  getDirections,
  decodePolyline,
} from "./utils/googleMaps";
import { CONFIG, DUMMY_DESTINATION } from "./constants/config";

export default function App() {
  // Location management
  const {
    location,
    error: locationError,
    permissionStatus,
    isLoading: locationLoading,
    getCurrentLocation,
  } = useLocation();

  // WebSocket connection
  const wsUrl = Constants.expoConfig?.extra?.wsUrl || process.env.WS_URL;
  const {
    isConnected,
    error: wsError,
    lastMessage,
    reconnectAttempts,
    sendLocationUpdate,
  } = useWebSocket(wsUrl);

  // State management
  const [eta, setEta] = useState(null);
  const [route, setRoute] = useState(null);
  const [isLoadingETA, setIsLoadingETA] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Calculate ETA and fetch route
  const updateETAAndRoute = useCallback(async () => {
    if (!location) return;

    try {
      // Calculate ETA
      setIsLoadingETA(true);
      const etaResult = await calculateETA(location.coords, DUMMY_DESTINATION);
      setEta(etaResult);

      // Get route directions
      setIsLoadingRoute(true);
      const routeResult = await getDirections(
        location.coords,
        DUMMY_DESTINATION
      );

      if (routeResult.success) {
        const coordinates = decodePolyline(routeResult.polyline);
        setRoute(coordinates);
      }
    } catch (error) {
      console.error("Error updating ETA and route:", error);
      Alert.alert("Error", "Failed to calculate route and ETA");
    } finally {
      setIsLoadingETA(false);
      setIsLoadingRoute(false);
    }
  }, [location]);

  // Send location updates via WebSocket
  useEffect(() => {
    if (location && isConnected) {
      const success = sendLocationUpdate(location);
      if (!success) {
        console.warn("Failed to send location update");
      }
    }
  }, [location, isConnected, sendLocationUpdate]);

  // Update ETA periodically
  useEffect(() => {
    if (!location) return;

    // Initial ETA calculation
    updateETAAndRoute();

    // Set up periodic ETA updates
    const etaInterval = setInterval(() => {
      updateETAAndRoute();
    }, CONFIG.ETA_UPDATE_INTERVAL);

    return () => clearInterval(etaInterval);
  }, [location, updateETAAndRoute]);

  // Handle permission denial
  const handleLocationRetry = useCallback(async () => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  // Render loading state
  if (locationLoading) {
    return <LoadingSpinner message="Getting your location..." />;
  }

  // Render permission denied state
  if (permissionStatus !== "granted") {
    return (
      <ErrorDisplay
        title="Location Permission Required"
        message="This app needs access to your location to track deliveries and provide navigation. Please grant location permission to continue."
        onRetry={handleLocationRetry}
        retryText="Grant Permission"
      />
    );
  }

  // Render location error state
  if (locationError && !location) {
    return (
      <ErrorDisplay
        title="Location Error"
        message={locationError}
        onRetry={handleLocationRetry}
        retryText="Retry"
      />
    );
  }

  // Render map
  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: CONFIG.MAP_DELTA.latitude,
              longitudeDelta: CONFIG.MAP_DELTA.longitude,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsTraffic={true}
            loadingEnabled={true}
          >
            {/* Rider's current location marker */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You (Rider)"
              description="Current location"
              pinColor="#007AFF"
            />

            {/* Destination marker */}
            <Marker
              coordinate={DUMMY_DESTINATION}
              title={DUMMY_DESTINATION.name}
              description="Delivery destination"
              pinColor="#FF3B30"
            />

            {/* Route polyline */}
            {route && route.length > 0 && (
              <Polyline
                coordinates={route}
                strokeColor="#007AFF"
                strokeWidth={4}
                strokePattern={[1]}
              />
            )}
          </MapView>

          {/* Status panel overlay */}
          <StatusPanel
            isConnected={isConnected}
            location={location}
            eta={eta}
            wsReconnectAttempts={reconnectAttempts}
            lastMessage={lastMessage}
          />

          {/* Loading indicators */}
          {(isLoadingETA || isLoadingRoute) && (
            <View style={styles.loadingOverlay}>
              <LoadingSpinner
                message={
                  isLoadingETA ? "Calculating ETA..." : "Loading route..."
                }
                size="small"
              />
            </View>
          )}
        </>
      ) : (
        <LoadingSpinner message="Loading map..." />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
