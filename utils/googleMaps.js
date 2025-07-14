import Constants from 'expo-constants';

// Get API key from environment
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey || process.env.GOOGLE_MAPS_API_KEY;

// Calculate ETA using Google Distance Matrix API
export const calculateETA = async (origin, destination) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destinationStr}&mode=driving&traffic_model=best_guess&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log('Fetching ETA from Google Distance Matrix API...');
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
      const element = data.rows[0].elements[0];
      return {
        distance: element.distance,
        duration: element.duration,
        duration_in_traffic: element.duration_in_traffic,
        success: true,
      };
    } else {
      throw new Error(data.error_message || 'Failed to calculate ETA');
    }
  } catch (error) {
    console.error('ETA calculation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get directions from Google Directions API
export const getDirections = async (origin, destination) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=driving&traffic_model=best_guess&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log('Fetching directions from Google Directions API...');
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        polyline: route.overview_polyline.points,
        legs: route.legs,
        distance: route.legs[0]?.distance,
        duration: route.legs[0]?.duration,
        success: true,
      };
    } else {
      throw new Error(data.error_message || 'No routes found');
    }
  } catch (error) {
    console.error('Directions fetch error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Decode polyline string to coordinates
export const decodePolyline = (encoded) => {
  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return coordinates;
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};
