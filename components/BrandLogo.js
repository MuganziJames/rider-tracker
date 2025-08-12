import React from "react";
import { View, Image, StyleSheet } from "react-native";

// SwiftDrop brand logo
const logoSource = require("../assets/swiftdrop.png");

const BrandLogo = ({ size = "large" }) => {
  const getImageStyle = () => {
    switch (size) {
      case "large":
        return { width: 365, height: 365 };
      case "medium":
        return { width: 239, height: 239 };
      case "small":
        return { width: 150, height: 150 };
      default:
        return { width: 365, height: 365 };
    }
  };

  return (
    <View style={styles.wrapper}>
      <Image
        source={logoSource}
        style={[styles.image, getImageStyle()]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    // Base style, size will be applied via getImageStyle()
  },
});

export default BrandLogo;
