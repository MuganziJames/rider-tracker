import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoadingSpinner = ({
  message = "Loading...",
  size = "large",
  color = "#007AFF",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default LoadingSpinner;
