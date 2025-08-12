import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, View, Dimensions, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Constants from "expo-constants";

// Custom hooks
import { useLocation } from "./hooks/useLocation";
import { useWebSocket } from "./hooks/useWebSocket";

// Components
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import ETAPanel from "./components/ETAPanel";

// Utils and constants
import { calculateETA, reverseGeocode } from "./utils/googleMaps";
import { getWebSocketUrl, validateGoogleMapsConfig } from "./utils/devConfig";
import { CONFIG } from "./constants/config";
import { mapStyles, lagosColors } from "./constants/mapStyles";

const { width, height } = Dimensions.get("window");

// Generate a unique driver ID (you can make this more sophisticated)
const generateDriverId = () => {
  return `driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function App() {
  // Generate or retrieve driver ID
  const [driverId] = useState(() => generateDriverId());

  // Initialize and validate configuration
  useEffect(() => {
    validateGoogleMapsConfig();
    console.log(" Driver ID generated:", driverId);
  }, [driverId]);

  // Location management
  const {
    location: currentLocation,
    error: locationError,
    permissionStatus,
    isLoading: locationLoading,
    getCurrentLocation,
    handleLocationError,
  } = useLocation();

  // Socket.IO connection with driver identification
  const wsUrl = getWebSocketUrl();
  const {
    isConnected,
    error: wsError,
    lastMessage,
    reconnectAttempts,
    sendLocationUpdate,
    onJobAssignment,
    onMessage,
  } = useWebSocket(wsUrl, driverId);

  // Listen for other server messages (not job assignments - handled separately)
  useEffect(() => {
    // Listen for driver-specific messages
    onMessage("driver-message", (message) => {
      console.log(" Driver message received:", message);
      Alert.alert("Driver Message", message.text || "New message received");
    });

    onMessage("system-alert", (alert) => {
      console.log(" System alert:", alert);
      Alert.alert("System Alert", alert.message || "System notification");
    });
  }, [onMessage]);

  // Job assignment state (for when backend sends jobs)
  const [currentJob, setCurrentJob] = useState(null);
  const [jobRoute, setJobRoute] = useState(null);
  const [jobETA, setJobETA] = useState(null);
  const [isLoadingJobETA, setIsLoadingJobETA] = useState(false);

  // Get Google Maps API key for MapViewDirections
  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

  // Map reference for controlling map view
  const mapRef = useRef(null);

  // Dynamic map region based on driver's location
  const getCurrentMapRegion = useCallback(() => {
    if (currentLocation) {
      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01, // Closer zoom for driver tracking
        longitudeDelta: 0.01,
      };
    }

    // Fallback region (Nigeria) if no GPS location yet
    return {
      latitude: 9.082,
      longitude: 8.6753,
      latitudeDelta: 8,
      longitudeDelta: 8,
    };
  }, [currentLocation]);

  // Center map on driver's location when GPS updates
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      const region = getCurrentMapRegion();
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [currentLocation, getCurrentMapRegion]);

  // Function to fit map to show both markers or current location
  // Job assignment handler - automatically triggered when job comes from backend
  const handleJobAssignment = useCallback(
    async (jobData) => {
      console.log(" Processing job assignment:", jobData);

      try {
        setCurrentJob(jobData);
        setIsLoadingJobETA(true);

        // Calculate route from current location to pickup, then to destination
        if (currentLocation && jobData.pickup && jobData.destination) {
          // Calculate ETA from driver location to pickup
          const pickupETA = await calculateETA(
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            },
            jobData.pickup
          );

          // Calculate ETA from pickup to destination
          const destinationETA = await calculateETA(
            jobData.pickup,
            jobData.destination
          );

          setJobETA({
            toPickup: pickupETA,
            toDestination: destinationETA,
          });

          // Fit map to show current location, pickup, and destination
          if (mapRef.current) {
            const coordinates = [
              {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              },
              jobData.pickup,
              jobData.destination,
            ];

            mapRef.current.fitToCoordinates(coordinates, {
              edgePadding: { top: 180, right: 50, bottom: 200, left: 50 },
              animated: true,
            });
          }
        }
      } catch (error) {
        console.error(" Error processing job assignment:", error);
        Alert.alert("Error", "Failed to process job assignment");
      } finally {
        setIsLoadingJobETA(false);
      }
    },
    [currentLocation]
  );

  // Update job assignment handler in useEffect
  useEffect(() => {
    onJobAssignment(handleJobAssignment);
  }, [onJobAssignment, handleJobAssignment]);

  // Send location updates via WebSocket
  useEffect(() => {
    if (currentLocation && isConnected) {
      const success = sendLocationUpdate(currentLocation);
      if (!success) {
        console.warn("Failed to send location update");
      }
    }
  }, [currentLocation, isConnected, sendLocationUpdate]);

  // Handle permission denial and location retry
  const handleLocationRetry = useCallback(async () => {
    setIsLoadingJobETA(true);

    try {
      const newLocation = await getCurrentLocation();

      if (newLocation) {
        // Successfully retrieved location on retry
        console.log(" Location retrieved on retry");
      } else {
        await handleLocationError("Initial location attempt failed");
      }
    } catch (error) {
      console.error("Error during location retry:", error);
    } finally {
      setIsLoadingJobETA(false);
    }
  }, [getCurrentLocation, handleLocationError]);

  // Render loading state
  if (locationLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <LoadingSpinner message="Setting up location services..." />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Render permission denied state
  if (permissionStatus !== "granted") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ErrorDisplay
            title="Location Permission Required"
            message="This app needs access to your location for better functionality. You can still use the app by manually selecting locations."
            onRetry={handleLocationRetry}
            retryText="Grant Permission"
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Main render - Clean GPS tracking interface
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Map View - Focused on driver's real location */}
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={mapStyles.minimal}
          initialRegion={getCurrentMapRegion()}
          showsUserLocation={!!currentLocation}
          showsMyLocationButton={false}
          showsTraffic={true}
          loadingEnabled={true}
          mapType="standard"
          pitchEnabled={true}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          toolbarEnabled={false}
          moveOnMarkerPress={false}
        >
          {/* Job Pickup Marker */}
          {currentJob?.pickup && (
            <Marker
              coordinate={currentJob.pickup}
              title="Pickup Location"
              description={currentJob.pickup.address || "Job pickup point"}
              pinColor="green"
              anchor={{ x: 0.5, y: 1 }}
            />
          )}

          {/* Job Destination Marker */}
          {currentJob?.destination && (
            <Marker
              coordinate={currentJob.destination}
              title="Destination"
              description={currentJob.destination.address || "Job destination"}
              pinColor="red"
              anchor={{ x: 0.5, y: 1 }}
            />
          )}

          {/* Route from current location to pickup to destination */}
          {currentJob && currentLocation && GOOGLE_MAPS_API_KEY && (
            <>
              {/* Route: Driver → Pickup */}
              <MapViewDirections
                origin={{
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                }}
                destination={currentJob.pickup}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor={lagosColors.success}
                mode="DRIVING"
                optimizeWaypoints={true}
                precision="high"
                timePrecision="now"
              />

              {/* Route: Pickup → Destination */}
              <MapViewDirections
                origin={currentJob.pickup}
                destination={currentJob.destination}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor={lagosColors.primary}
                mode="DRIVING"
                optimizeWaypoints={true}
                precision="high"
                timePrecision="now"
                onError={(errorMessage) => {
                  console.warn("Route calculation error:", errorMessage);
                }}
              />
            </>
          )}
        </MapView>

        {/* Job Assignment ETA Panel - Only show when job is active */}
        {currentJob && (
          <ETAPanel
            originAddress="Current Location"
            destinationAddress={
              currentJob.destination?.address || "Job Destination"
            }
            eta={jobETA?.toDestination}
            isLoading={isLoadingJobETA}
            isVisible={true}
          />
        )}

        {/* Connection Status Indicator */}
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.connectionDot,
              {
                backgroundColor: isConnected
                  ? lagosColors.success
                  : lagosColors.error,
              },
            ]}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lagosColors.background,
  },
  map: {
    flex: 1,
  },
  statusIndicator: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
