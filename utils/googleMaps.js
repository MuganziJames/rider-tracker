import Constants from "expo-constants";

// Get API key from environment - Using only secure Expo configuration
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

// Google Places Autocomplete API
export const searchPlaces = async (query) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    if (!query || query.trim().length < 2) {
      return { success: true, predictions: [] };
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    console.log("Searching places:", query);
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      return {
        success: true,
        predictions: data.predictions || [],
      };
    } else {
      throw new Error(data.error_message || "Failed to search places");
    }
  } catch (error) {
    console.error("Places search error:", error);
    return {
      success: false,
      error: error.message,
      predictions: [],
    };
  }
};

// Get place details by place_id
export const getPlaceDetails = async (placeId) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,name&key=${GOOGLE_MAPS_API_KEY}`;

    console.log("Getting place details for:", placeId);
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.result) {
      return {
        success: true,
        location: {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        },
        address: data.result.formatted_address,
        name: data.result.name,
      };
    } else {
      throw new Error(data.error_message || "Failed to get place details");
    }
  } catch (error) {
    console.error("Place details error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Reverse geocoding - convert coordinates to address
export const reverseGeocode = async (latitude, longitude) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    console.log("Reverse geocoding:", latitude, longitude);
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return {
        success: true,
        address: data.results[0].formatted_address,
        shortAddress:
          data.results[0].address_components[0]?.long_name ||
          data.results[0].formatted_address,
      };
    } else {
      throw new Error("No address found for this location");
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {
      success: false,
      error: error.message,
      address: "Unknown location",
    };
  }
};

// Calculate ETA using Google Distance Matrix API
export const calculateETA = async (origin, destination) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destinationStr}&mode=driving&traffic_model=best_guess&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;

    console.log("Fetching ETA from Google Distance Matrix API...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.rows[0]?.elements[0]?.status === "OK") {
      const element = data.rows[0].elements[0];
      return {
        distance: element.distance,
        duration: element.duration,
        duration_in_traffic: element.duration_in_traffic,
        success: true,
      };
    } else {
      throw new Error(data.error_message || "Failed to calculate ETA");
    }
  } catch (error) {
    console.error("ETA calculation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.latitude * Math.PI) / 180) *
      Math.cos((point2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
