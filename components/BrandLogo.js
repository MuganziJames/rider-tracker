import React from "react";
import { View, Image, StyleSheet } from "react-native";

// SwiftDrop brand logo
const logoSource = require("../assets/swiftdrop.png");

const BrandLogo = () => {
  return (
    <View style={styles.wrapper}>
      <Image source={logoSource} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 180,
    height: 150,
  },
});

export default BrandLogo;
