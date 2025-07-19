// Socket.IO service for driver tracking
import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.driverId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  // Connect to the socket.io server
  connect(serverUrl, driverId = "driver_001") {
    return new Promise((resolve, reject) => {
      try {
        // Store driver ID for reuse
        this.driverId = driverId;

        console.log("🚀 Connecting to socket.io server:", serverUrl);

        // Create socket connection with better timeout settings
        this.socket = io(serverUrl, {
          transports: ["websocket", "polling"], // Allow fallback to polling
          timeout: 30000, // Increased timeout to 30 seconds for Render servers
          reconnection: true,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: 10000, // Max delay between attempts
          reconnectionAttempts: this.maxReconnectAttempts,
          forceNew: true, // Force a new connection
        });

        // Connection successful
        this.socket.on("connect", () => {
          console.log("✅ Connected to mini-trace server");
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Identify as driver immediately after connection
          this.identifyAsDriver(driverId);

          resolve(this.socket);
        });

        // Connection error - but don't reject immediately, let reconnection handle it
        this.socket.on("connect_error", (error) => {
          console.warn("⚠️ Socket connection error:", error.message);
          this.isConnected = false;

          // Only reject if this is the first attempt and it's been more than 45 seconds
          if (this.reconnectAttempts === 0) {
            setTimeout(() => {
              if (!this.isConnected && this.reconnectAttempts === 0) {
                reject(error);
              }
            }, 45000);
          }
        });

        // Disconnection
        this.socket.on("disconnect", (reason) => {
          console.log("⚠️ Disconnected from server:", reason);
          this.isConnected = false;
        });

        // Reconnection attempts
        this.socket.on("reconnect_attempt", (attemptNumber) => {
          console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
          this.reconnectAttempts = attemptNumber;
        });

        // Successful reconnection
        this.socket.on("reconnect", (attemptNumber) => {
          console.log(`✅ Reconnected after ${attemptNumber} attempts`);
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Re-identify as driver after reconnection
          this.identifyAsDriver(this.driverId);
        });

        // Failed to reconnect after all attempts
        this.socket.on("reconnect_failed", () => {
          console.error("❌ Failed to reconnect after all attempts");
          this.isConnected = false;
        });
      } catch (error) {
        console.error("❌ Failed to create socket connection:", error);
        reject(error);
      }
    });
  }

  // Identify as driver using connect-user event
  identifyAsDriver(driverId) {
    if (!this.socket || !this.isConnected) {
      console.warn("⚠️ Cannot identify driver: Socket not connected");
      return false;
    }

    try {
      const userData = {
        userId: driverId,
        role: "driver",
        timestamp: new Date().toISOString(),
        platform: "mobile-app",
      };

      this.socket.emit("connect-user", userData);
      console.log("👤 Driver identified:", userData);
      return true;
    } catch (error) {
      console.error("❌ Failed to identify as driver:", error);
      return false;
    }
  }

  // Send location update
  sendLocationUpdate(latitude, longitude, driverId = null) {
    if (!this.socket || !this.isConnected) {
      console.warn("⚠️ Cannot send location: Socket not connected");
      return false;
    }

    try {
      const locationData = {
        driverId: driverId || this.driverId,
        lat: latitude,
        lng: longitude,
        timestamp: new Date().toISOString(),
      };

      this.socket.emit("location-update", locationData);
      console.log("📍 Location update sent:", locationData);
      return true;
    } catch (error) {
      console.error("❌ Failed to send location update:", error);
      return false;
    }
  }

  // Listen for job assignments (for future use)
  onJobAssignment(callback) {
    if (!this.socket) {
      console.warn("⚠️ Cannot listen for jobs: Socket not initialized");
      return;
    }

    this.socket.on("job-assignment", (jobData) => {
      console.log("🚛 New job assignment received:", jobData);
      callback(jobData);
    });
  }

  // Listen for any server messages
  onMessage(eventName, callback) {
    if (!this.socket) {
      console.warn("⚠️ Cannot listen for messages: Socket not initialized");
      return;
    }

    this.socket.on(eventName, callback);
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      driverId: this.driverId,
    };
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("🔌 Socket disconnected");
    }
  }
}

// Export singleton instance
export default new SocketService();
