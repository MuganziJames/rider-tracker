import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OnboardingNavigator from "./navigation/OnboardingNavigator";

// Entry point for the app with onboarding flow
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <OnboardingNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
