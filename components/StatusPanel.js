import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StatusPanel = ({
  isConnected,
  location,
  eta,
  wsReconnectAttempts,
  lastMessage,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { top: insets.top + 10 }]}>
      {/* WebSocket Status */}
      <View style={styles.statusRow}>
        <View
          style={[
            styles.indicator,
            { backgroundColor: isConnected ? "#4CAF50" : "#F44336" },
          ]}
        />
        <Text style={styles.statusText}>
          {isConnected
            ? "Connected to Server"
            : `Connecting... (${wsReconnectAttempts} attempts)`}
        </Text>
      </View>

      {/* Location Status */}
      {location ? (
        <View style={styles.statusRow}>
          <View style={[styles.indicator, { backgroundColor: "#2196F3" }]} />
          <Text style={styles.statusText}>
            GPS: {location.coords.latitude.toFixed(6)},{" "}
            {location.coords.longitude.toFixed(6)}
          </Text>
        </View>
      ) : null}

      {/* ETA Display */}
      {eta && eta.success ? (
        <View style={styles.statusRow}>
          <View style={[styles.indicator, { backgroundColor: "#FF9800" }]} />
          <Text style={styles.statusText}>
            ETA: {eta.duration?.text} ({eta.distance?.text})
          </Text>
        </View>
      ) : null}

      {/* Last Message */}
      {lastMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Last Server Message:</Text>
          <Text style={styles.messageText}>
            {typeof lastMessage === "object"
              ? JSON.stringify(lastMessage, null, 2)
              : String(lastMessage)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  messageContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  messageLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 10,
    color: "#444",
    fontFamily: "monospace",
    maxHeight: 60,
  },
});

export default StatusPanel;
