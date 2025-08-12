import React from "react";
import { View, Image, StyleSheet } from "react-native";

// Brand logo placeholder until you add: assets/swiftdroplogo.png
const BrandLogo = () => {
  return (
    <View style={styles.wrapper}>
      {/* Placeholder logo - replace when you add assets/swiftdroplogo.png */}
      <View style={styles.placeholder}>
        <View style={styles.logoIcon} />
        <View style={styles.logoLines}>
          <View style={styles.line1} />
          <View style={styles.line2} />
          <View style={styles.line3} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 68,
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5722",
    borderRadius: 8,
    position: "relative",
  },
  logoIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    marginRight: 8,
  },
  logoLines: {
    flexDirection: "column",
    gap: 2,
  },
  line1: {
    width: 16,
    height: 3,
    backgroundColor: "#FFF",
    borderRadius: 1,
  },
  line2: {
    width: 12,
    height: 3,
    backgroundColor: "#FFF",
    borderRadius: 1,
  },
  line3: {
    width: 8,
    height: 3,
    backgroundColor: "#FFF",
    borderRadius: 1,
  },
});

export default BrandLogo;
