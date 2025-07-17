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
import LocationSearchInput from "./components/LocationSearchInput";
import LocationSuggestions from "./components/LocationSuggestions";
import ETAPanel from "./components/ETAPanel";

// Utils and constants
import {
  calculateETA,
  calculateDistance,
  reverseGeocode,
  searchPlaces,
  getPlaceDetails,
} from "./utils/googleMaps";
import { getWebSocketUrl, validateGoogleMapsConfig } from "./utils/devConfig";
import { CONFIG } from "./constants/config";
import { mapStyles, lagosColors } from "./constants/mapStyles";

const { width, height } = Dimensions.get("window");

export default function App() {
  // Initialize and validate configuration
  useEffect(() => {
    validateGoogleMapsConfig();
  }, []);

  // Location management
  const {
    location: currentLocation,
    error: locationError,
    permissionStatus,
    isLoading: locationLoading,
    getCurrentLocation,
    handleLocationError,
  } = useLocation();

  // WebSocket connection - safer URL handling
  const wsUrl = getWebSocketUrl();
  const {
    isConnected,
    error: wsError,
    lastMessage,
    reconnectAttempts,
    sendLocationUpdate,
  } = useWebSocket(wsUrl);

  // Location picker state
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [activeInput, setActiveInput] = useState(null); // 'origin' or 'destination'

  // Route and ETA state
  const [eta, setEta] = useState(null);
  const [isLoadingETA, setIsLoadingETA] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Map interaction state
  const [isMapAnimating, setIsMapAnimating] = useState(false);
  const [isProcessingSuggestion, setIsProcessingSuggestion] = useState(false);
  const [preventBlur, setPreventBlur] = useState(false);

  // Get Google Maps API key for MapViewDirections
  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

  // Map reference for controlling map view
  const mapRef = useRef(null);
  const searchTimeout = useRef(null);

  // Default map region (centered on Nigeria)
  const defaultRegion = {
    latitude: 9.082,
    longitude: 8.6753,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  // Function to fit map to show both markers or current location
  const fitMapToMarkers = useCallback(() => {
    if (!mapRef.current) return;

    setIsMapAnimating(true);

    if (originLocation && destinationLocation) {
      // Fit to show both origin and destination
      mapRef.current.fitToCoordinates([originLocation, destinationLocation], {
        edgePadding: { top: 180, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    } else if (originLocation) {
      // Center on origin only - don't auto-center on current location
      mapRef.current.animateToRegion(
        {
          ...originLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    } else if (destinationLocation) {
      // Center on destination if only destination is set
      mapRef.current.animateToRegion(
        {
          ...destinationLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }

    // Re-enable map interaction after animation
    setTimeout(() => setIsMapAnimating(false), 1500);
    // Removed: auto-centering on current location when neither origin nor destination is set
  }, [originLocation, destinationLocation]);

  // Handle text change and search suggestions
  const handleTextChange = useCallback((text, type) => {
    if (type === "origin") {
      setOriginAddress(text);
    } else {
      setDestinationAddress(text);
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search
    searchTimeout.current = setTimeout(async () => {
      if (text.trim().length >= 2) {
        setIsLoadingSuggestions(true);
        const result = await searchPlaces(text);
        if (result.success) {
          setSuggestions(result.predictions);
          setShowSuggestions(true);
        }
        setIsLoadingSuggestions(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, []);

  // Handle suggestion selection
  const handleSuggestionPress = useCallback(
    async (prediction) => {
      if (!activeInput) {
        return;
      }

      setIsProcessingSuggestion(true); // Block map interactions
      setIsLoadingSuggestions(true);
      setShowSuggestions(false);

      const placeDetails = await getPlaceDetails(prediction.place_id);
      if (placeDetails.success) {
        // Prioritize readable name over address, and clean up Plus Codes
        let displayAddress = placeDetails.name || placeDetails.address;

        // If the address contains Plus Codes, try to use a cleaner version
        if (displayAddress.includes("+") && placeDetails.address) {
          // Use the formatted address but try to clean it up
          const addressParts = placeDetails.address.split(",");
          if (addressParts.length > 1) {
            // Take the first few parts that don't contain Plus Codes
            displayAddress = addressParts
              .filter((part) => !part.trim().includes("+"))
              .slice(0, 2)
              .join(", ")
              .trim();
          }
        }

        // Fallback to place name if address is still problematic
        if (!displayAddress || displayAddress.includes("+")) {
          displayAddress = placeDetails.name || "Selected Location";
        }

        const locationData = {
          location: placeDetails.location,
          address: displayAddress,
          name: placeDetails.name,
        };

        if (activeInput === "origin") {
          setOriginLocation(locationData.location);
          setOriginAddress(locationData.address);
        } else {
          setDestinationLocation(locationData.location);
          setDestinationAddress(locationData.address);
        }

        setActiveInput(null);

        // Fit map after a short delay
        setTimeout(() => fitMapToMarkers(), 500);
      } else {
        console.error("Failed to get place details:", placeDetails.error);
      }
      setIsLoadingSuggestions(false);

      // Allow map interactions again after a delay
      setTimeout(() => setIsProcessingSuggestion(false), 1000);
    },
    [activeInput, fitMapToMarkers]
  );

  // Handle input focus
  const handleInputFocus = useCallback(
    (type) => {
      setActiveInput(type);
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    },
    [suggestions]
  );

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    // Don't clear active input if we're preventing blur (user interacting with suggestions)
    if (preventBlur) {
      return;
    }

    // Longer delay to allow suggestion taps to be processed properly
    setTimeout(() => {
      if (!preventBlur) {
        // Double check
        setActiveInput(null);
        setShowSuggestions(false);
      }
    }, 300); // Increased from 150ms to 300ms
  }, [preventBlur]);

  // Handle using current location as origin
  const handleUseCurrentLocation = useCallback(async () => {
    if (!currentLocation) {
      Alert.alert(
        "Location Error",
        "Current location not available. Please enable GPS."
      );
      return;
    }

    const coords = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    // Reverse geocode to get address
    const geocodeResult = await reverseGeocode(
      coords.latitude,
      coords.longitude
    );
    const address = geocodeResult.success
      ? geocodeResult.address
      : "Current Location";

    setOriginLocation(coords);
    setOriginAddress(address);
    setActiveInput(null);

    // Fit map to show current location
    setTimeout(() => fitMapToMarkers(), 500);
  }, [currentLocation, fitMapToMarkers]);

  // Handle location selection from search
  const handleLocationSelect = useCallback(
    (type, locationData) => {
      if (type === "origin") {
        setOriginLocation(locationData.location);
        setOriginAddress(locationData.address);
      } else {
        setDestinationLocation(locationData.location);
        setDestinationAddress(locationData.address);
      }
      setActiveInput(null);

      // Fit map after a short delay
      setTimeout(() => fitMapToMarkers(), 500);
    },
    [fitMapToMarkers]
  );

  // Handle map tap to set location
  const handleMapPress = useCallback(
    async (event) => {
      // Don't allow map press during animations, suggestion processing, or when no input is active
      if (!activeInput || isMapAnimating || isProcessingSuggestion) {
        return;
      }

      const coordinate = event.nativeEvent.coordinate;

      // Reverse geocode to get address
      const geocodeResult = await reverseGeocode(
        coordinate.latitude,
        coordinate.longitude
      );
      const address = geocodeResult.success
        ? geocodeResult.address
        : "Selected Location";

      if (activeInput === "origin") {
        setOriginLocation(coordinate);
        setOriginAddress(address);
      } else {
        setDestinationLocation(coordinate);
        setDestinationAddress(address);
      }

      setActiveInput(null);
    },
    [activeInput, isMapAnimating, isProcessingSuggestion]
  );

  // Swap origin and destination
  const handleSwapLocations = useCallback(() => {
    const tempLocation = originLocation;
    const tempAddress = originAddress;

    setOriginLocation(destinationLocation);
    setOriginAddress(destinationAddress);
    setDestinationLocation(tempLocation);
    setDestinationAddress(tempAddress);
  }, [originLocation, originAddress, destinationLocation, destinationAddress]);

  // Calculate ETA
  const updateETA = useCallback(async () => {
    if (!originLocation || !destinationLocation) {
      setEta(null);
      return;
    }

    try {
      setIsLoadingETA(true);

      // Calculate ETA using Distance Matrix API
      const etaResult = await calculateETA(originLocation, destinationLocation);
      setEta(etaResult);
    } catch (error) {
      console.error("Error updating ETA:", error);
    } finally {
      setIsLoadingETA(false);
    }
  }, [originLocation, destinationLocation]);

  // Auto-calculate ETA when both locations are set
  useEffect(() => {
    if (originLocation && destinationLocation) {
      updateETA();
    }
  }, [originLocation, destinationLocation, updateETA]);

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
    setIsLoadingETA(true);

    try {
      const newLocation = await getCurrentLocation();

      if (newLocation) {
        // Successfully retrieved location on retry
      } else {
        await handleLocationError("Initial location attempt failed");
      }
    } catch (error) {
      console.error("Error during location retry:", error);
    } finally {
      setIsLoadingETA(false);
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

  // Main render
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Map View */}
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={mapStyles.minimal}
          initialRegion={defaultRegion}
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
          onPress={handleMapPress}
        >
          {/* Origin marker */}
          {originLocation && (
            <Marker
              coordinate={originLocation}
              title="Origin"
              description={originAddress}
              pinColor="green"
              anchor={{ x: 0.5, y: 1 }}
            />
          )}

          {/* Destination marker */}
          {destinationLocation && (
            <Marker
              coordinate={destinationLocation}
              title="Destination"
              description={destinationAddress}
              pinColor="red"
              anchor={{ x: 0.5, y: 1 }}
            />
          )}

          {/* MapViewDirections for road-following routes */}
          {originLocation && destinationLocation && GOOGLE_MAPS_API_KEY && (
            <MapViewDirections
              origin={originLocation}
              destination={destinationLocation}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={6}
              strokeColor={lagosColors.primary}
              mode="DRIVING"
              optimizeWaypoints={true}
              precision="high"
              timePrecision="now"
              onReady={(result) => {
                // Fit map to show the route with proper padding
                if (mapRef.current && result.coordinates?.length > 0) {
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 180, right: 50, bottom: 200, left: 50 },
                    animated: true,
                  });
                }
              }}
              onError={(errorMessage) => {
                // You could show a user-friendly error message here
                Alert.alert(
                  "Route Error",
                  "Unable to calculate route. Please try different locations.",
                  [{ text: "OK" }]
                );
              }}
              onStart={(params) => {
                // Starting route calculation...
              }}
            />
          )}
        </MapView>

        {/* Search Inputs */}
        <View style={styles.searchContainer}>
          <LocationSearchInput
            placeholder="Choose starting location"
            value={originAddress}
            onLocationSelect={(data) => handleLocationSelect("origin", data)}
            onTextChange={(text) => handleTextChange(text, "origin")}
            showCurrentLocationButton={!!currentLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
            isActive={activeInput === "origin"}
            onFocus={() => handleInputFocus("origin")}
            onBlur={handleInputBlur}
          />
          <View style={styles.searchSpacing} />
          <View style={styles.destinationContainer}>
            <LocationSearchInput
              placeholder="Choose destination"
              value={destinationAddress}
              onLocationSelect={(data) =>
                handleLocationSelect("destination", data)
              }
              onTextChange={(text) => handleTextChange(text, "destination")}
              isActive={activeInput === "destination"}
              onFocus={() => handleInputFocus("destination")}
              onBlur={handleInputBlur}
            />
            <LocationSuggestions
              suggestions={suggestions}
              isVisible={showSuggestions}
              onSuggestionPress={handleSuggestionPress}
              onSuggestionTouchStart={() => setPreventBlur(true)}
              onSuggestionTouchEnd={() => setPreventBlur(false)}
            />
          </View>
        </View>

        {/* ETA Panel */}
        <ETAPanel
          originAddress={originAddress}
          destinationAddress={destinationAddress}
          eta={eta}
          isLoading={isLoadingETA}
          onSwapLocations={handleSwapLocations}
          isVisible={!!(originAddress || destinationAddress)}
        />
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
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchSpacing: {
    height: 12,
  },
  destinationContainer: {
    position: "relative",
    zIndex: 1000,
  },
});
