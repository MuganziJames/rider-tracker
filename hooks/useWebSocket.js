import { useState, useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import socketService from "../utils/socketService";

export const useWebSocket = (url, driverId = "driver_001") => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const socketRef = useRef(null);
  const connectionStatusRef = useRef(null);

  // Connect to socket.io server
  const connect = useCallback(async () => {
    try {
      if (!url || url.trim() === "") {
        setError("WebSocket URL not configured");
        return;
      }

      console.log("🚀 Connecting to socket.io server:", url);
      setError(null); // Clear any previous errors

      // Connect using our socket service
      await socketService.connect(url, driverId);

      // Store socket reference
      socketRef.current = socketService.socket;

      // Set up event listeners
      setupEventListeners();

      setIsConnected(true);
      setError(null);
      setReconnectAttempts(0);
    } catch (err) {
      console.warn("Initial socket.io connection attempt failed:", err.message);

      // Don't treat this as a fatal error since socket.io will keep trying
      // Just set a user-friendly message
      setError(`Connecting to server... (${err.message})`);
      setIsConnected(false);

      // The socket service will continue trying to reconnect automatically
    }
  }, [url, driverId]);

  // Set up event listeners
  const setupEventListeners = useCallback(() => {
    if (!socketRef.current) return;

    // Connection events
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      setError(null);
      setReconnectAttempts(0);
    });

    socketRef.current.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("Disconnected:", reason);
    });

    socketRef.current.on("connect_error", (error) => {
      setError(error.message);
      setIsConnected(false);
    });

    socketRef.current.on("reconnect_attempt", (attemptNumber) => {
      setReconnectAttempts(attemptNumber);
    });

    socketRef.current.on("reconnect", () => {
      setIsConnected(true);
      setError(null);
      setReconnectAttempts(0);
    });

    // Listen for any server messages
    socketRef.current.onAny((eventName, ...args) => {
      setLastMessage({
        event: eventName,
        data: args,
        timestamp: new Date().toISOString(),
      });
    });
  }, []);

  // Send location update using our socket service
  const sendLocationUpdate = useCallback(
    (location) => {
      if (!location || !location.coords) {
        console.warn("Invalid location data");
        return false;
      }

      const { latitude, longitude } = location.coords;

      // Use socket service to send location
      return socketService.sendLocationUpdate(latitude, longitude, driverId);
    },
    [driverId]
  );

  // Send custom message
  const sendMessage = useCallback(
    (eventName, data) => {
      if (!socketRef.current || !isConnected) {
        console.warn("Cannot send message: Socket not connected");
        return false;
      }

      try {
        socketRef.current.emit(eventName, data);
        return true;
      } catch (err) {
        console.error("Failed to send message:", err);
        setError(`Failed to send message: ${err.message}`);
        return false;
      }
    },
    [isConnected]
  );

  // Listen for job assignments (for future use)
  const onJobAssignment = useCallback((callback) => {
    socketService.onJobAssignment(callback);
  }, []);

  // Listen for custom events
  const onMessage = useCallback((eventName, callback) => {
    socketService.onMessage(eventName, callback);
  }, []);

  // Get connection status
  const getStatus = useCallback(() => {
    return socketService.getConnectionStatus();
  }, []);

  // Initialize connection
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
      socketRef.current = null;
    };
  }, [connect]);

  // Update reconnect attempts from socket service
  useEffect(() => {
    const interval = setInterval(() => {
      const status = socketService.getConnectionStatus();
      if (status.reconnectAttempts !== reconnectAttempts) {
        setReconnectAttempts(status.reconnectAttempts);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reconnectAttempts]);

  return {
    isConnected,
    error,
    lastMessage,
    reconnectAttempts,
    sendMessage,
    sendLocationUpdate,
    onJobAssignment,
    onMessage,
    getStatus,
    reconnect: connect,
  };
};
