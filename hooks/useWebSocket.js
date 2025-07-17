import { useState, useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import { CONFIG } from "../constants/config";

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      if (!url || url.trim() === "") {
        setError("WebSocket URL not configured");
        return;
      }

      // Close existing connection
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }

      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);

        // Send initial connection message
        sendMessage({
          type: "rider_connected",
          timestamp: new Date().toISOString(),
          message: "Rider mobile app connected",
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (err) {
          setLastMessage({ raw: event.data });
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
      };

      ws.current.onclose = (event) => {
        setIsConnected(false);

        // Attempt to reconnect if not intentionally closed
        if (
          event.code !== 1000 &&
          reconnectAttempts < CONFIG.MAX_RECONNECT_ATTEMPTS
        ) {
          scheduleReconnect();
        }
      };
    } catch (err) {
      console.error("WebSocket connection failed:", err);
      setError("Failed to connect to WebSocket");
    }
  }, [url, reconnectAttempts]);

  // Schedule reconnection
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }

    const delay =
      CONFIG.WEBSOCKET_RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts);

    reconnectTimeout.current = setTimeout(() => {
      setReconnectAttempts((prev) => prev + 1);
      connect();
    }, delay);
  }, [connect, reconnectAttempts]);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        const messageString =
          typeof message === "string" ? message : JSON.stringify(message);
        ws.current.send(messageString);
        return true;
      } catch (err) {
        console.error("Failed to send WebSocket message:", err);
        setError("Failed to send message");
        return false;
      }
    } else {
      return false;
    }
  }, []);

  // Send location update with enhanced data
  const sendLocationUpdate = useCallback(
    (location) => {
      if (!location) return false;

      const locationMessage = {
        type: "location_update",
        timestamp: new Date().toISOString(),
        rider_id: "rider_001", // This should come from auth/user context
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          speed: location.coords.speed,
          heading: location.coords.heading,
          altitude: location.coords.altitude,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          timestamp: location.timestamp,
        },
        device_info: {
          platform: Platform.OS,
          version: Platform.Version,
          battery: null, // Could be implemented with a battery tracking hook
        },
      };

      return sendMessage(locationMessage);
    },
    [sendMessage]
  );

  // Initialize connection
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close(1000, "Component unmounting");
      }
    };
  }, [connect]);

  return {
    isConnected,
    error,
    lastMessage,
    reconnectAttempts,
    sendMessage,
    sendLocationUpdate,
    reconnect: connect,
  };
};
