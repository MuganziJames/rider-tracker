import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BrandLogo from "../components/BrandLogo";

const { width } = Dimensions.get("window");

const OnboardingSplashScreen = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    const animationSequence = Animated.sequence([
      // First, fade in the background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Then slide the logo from left to center
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      // After animation completes, wait a moment then navigate
      setTimeout(() => {
        navigation.replace("OnboardingWelcome");
      }, 800);
    });
  }, [slideAnim, fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#FF6B35"
        translucent={false}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={["#FF6B35", "#F7931E"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <BrandLogo />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingSplashScreen;
