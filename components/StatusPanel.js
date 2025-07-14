import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusPanel = ({ 
  isConnected, 
  location, 
  eta, 
  wsReconnectAttempts,
  lastMessage 
}) => {
  return (
    <View style={styles.container}>
      {/* WebSocket Status */}
      <View style={styles.statusRow}>
        <View style={[styles.indicator, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Connected to Server' : `Connecting... (${wsReconnectAttempts} attempts)`}
        </Text>
      </View>

      {/* Location Status */}
      {location && (
        <View style={styles.statusRow}>
          <View style={[styles.indicator, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.statusText}>
            GPS: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      {/* ETA Display */}
      {eta && eta.success && (
        <View style={styles.statusRow}>
          <View style={[styles.indicator, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.statusText}>
            ETA: {eta.duration?.text} ({eta.distance?.text})
          </Text>
        </View>
      )}

      {/* Last Message */}
      {lastMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Last Server Message:</Text>
          <Text style={styles.messageText}>
            {typeof lastMessage === 'object' ? JSON.stringify(lastMessage, null, 2) : lastMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#333',
    flex: 1,
  },
  messageContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  messageLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 10,
    color: '#444',
    fontFamily: 'monospace',
    maxHeight: 60,
  },
});

export default StatusPanel;
