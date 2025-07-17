import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lagosColors } from "../constants/mapStyles";

const ETAPanel = ({
  originAddress = "",
  destinationAddress = "",
  eta = null,
  isLoading = false,
  onSwapLocations,
  isVisible = true,
}) => {
  const formatDuration = (duration) => {
    if (!duration || !duration.text) return "Calculating...";
    return duration.text;
  };

  const formatDistance = (distance) => {
    if (!distance || !distance.text) return "";
    return distance.text;
  };

  const formatTrafficInfo = (eta) => {
    if (!eta || !eta.duration_in_traffic) return null;

    const normalDuration = eta.duration?.value || 0;
    const trafficDuration = eta.duration_in_traffic?.value || 0;
    const delay = trafficDuration - normalDuration;

    if (delay > 300) {
      // More than 5 minutes delay
      return {
        text: `+${Math.round(delay / 60)}min delay`,
        color: lagosColors.error,
        icon: "traffic",
      };
    } else if (delay > 60) {
      // 1-5 minutes delay
      return {
        text: "Light traffic",
        color: lagosColors.warning,
        icon: "traffic",
      };
    } else {
      return {
        text: "Clear traffic",
        color: lagosColors.success,
        icon: "traffic",
      };
    }
  };

  if (!isVisible) return null;

  const insets = useSafeAreaInsets();
  const trafficInfo = formatTrafficInfo(eta);
  const shouldShowETA = eta && eta.success && !isLoading;

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {/* Route Information */}
      <View style={styles.routeContainer}>
        <View style={styles.locationRow}>
          <MaterialIcons
            name="trip-origin"
            size={16}
            color={lagosColors.success}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {originAddress || "Choose starting location"}
          </Text>
        </View>

        {/* Swap Button */}
        {originAddress && destinationAddress && (
          <TouchableOpacity style={styles.swapButton} onPress={onSwapLocations}>
            <MaterialIcons
              name="swap-vert"
              size={20}
              color={lagosColors.primary}
            />
          </TouchableOpacity>
        )}

        <View style={styles.locationRow}>
          <MaterialIcons
            name="location-on"
            size={16}
            color={lagosColors.error}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {destinationAddress || "Choose destination"}
          </Text>
        </View>
      </View>

      {/* ETA Information */}
      {shouldShowETA && (
        <View style={styles.etaContainer}>
          <View style={styles.etaRow}>
            <View style={styles.etaMainInfo}>
              <MaterialIcons
                name="schedule"
                size={20}
                color={lagosColors.primary}
              />
              <Text style={styles.etaDuration}>
                {formatDuration(eta.duration_in_traffic || eta.duration)}
              </Text>
              <Text style={styles.etaDistance}>
                ({formatDistance(eta.distance)})
              </Text>
            </View>

            {trafficInfo && (
              <View style={styles.trafficInfo}>
                <MaterialIcons
                  name={trafficInfo.icon}
                  size={16}
                  color={trafficInfo.color}
                />
                <Text
                  style={[styles.trafficText, { color: trafficInfo.color }]}
                >
                  {trafficInfo.text}
                </Text>
              </View>
            )}
          </View>

          {/* Route Summary */}
          <Text style={styles.routeSummary}>Via main roads • Updated now</Text>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <MaterialIcons
            name="schedule"
            size={20}
            color={lagosColors.textSecondary}
          />
          <Text style={styles.loadingText}>Calculating route...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  routeContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: lagosColors.text,
    fontWeight: "500",
  },
  swapButton: {
    alignSelf: "center",
    padding: 8,
    marginVertical: 4,
  },
  etaContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    paddingTop: 12,
  },
  etaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  etaMainInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  etaDuration: {
    fontSize: 18,
    fontWeight: "bold",
    color: lagosColors.text,
    marginLeft: 8,
  },
  etaDistance: {
    fontSize: 14,
    color: lagosColors.textSecondary,
    marginLeft: 8,
  },
  trafficInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  trafficText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  routeSummary: {
    fontSize: 12,
    color: lagosColors.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: lagosColors.textSecondary,
    marginLeft: 8,
  },
});

export default ETAPanel;
