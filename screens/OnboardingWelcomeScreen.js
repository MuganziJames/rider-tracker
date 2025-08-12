import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Animated,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import BrandLogo from "../components/BrandLogo";
import PrimaryButton from "../components/PrimaryButton";

const { width, height } = Dimensions.get("window");

const OnboardingWelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate the content in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideUpAnim]);

  const handleLogIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <ImageBackground
        source={require("../assets/onboarding-background.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          {/* Logo in center */}
          <View style={styles.logoSection}>
            <BrandLogo />
          </View>

          {/* Bottom section with login button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogIn}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 50,
  },
  logoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingLeft: 0,
  },
  brandText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B35",
    marginTop: 12,
    letterSpacing: 1,
    textAlign: "center",
  },
  bottomSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  loginButton: {
    width: width - 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
});

export default OnboardingWelcomeScreen;
