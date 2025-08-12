import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Onboarding screens
import OnboardingSplashScreen from "../screens/OnboardingSplashScreen";
import OnboardingWelcomeScreen from "../screens/OnboardingWelcomeScreen";

// Auth screens
import SignInScreen from "../screens/SignInScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import CreatePasswordScreen from "../screens/CreatePasswordScreen";
import ResetSuccessScreen from "../screens/ResetSuccessScreen";

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingSplash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back on onboarding screens
        animation: "fade", // Smooth transitions
      }}
    >
      {/* Onboarding Flow */}
      <Stack.Screen
        name="OnboardingSplash"
        component={OnboardingSplashScreen}
        options={{
          gestureEnabled: false, // No going back from splash
        }}
      />
      <Stack.Screen
        name="OnboardingWelcome"
        component={OnboardingWelcomeScreen}
        options={{
          gestureEnabled: false, // No going back from welcome
        }}
      />

      {/* Auth Flow */}
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          gestureEnabled: true, // Allow going back to onboarding
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="VerifyCode"
        component={VerifyCodeScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="CreatePassword"
        component={CreatePasswordScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="ResetSuccess"
        component={ResetSuccessScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
