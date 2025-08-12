import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";
import BrandLogo from "../components/BrandLogo";
import FormTextInput from "../components/FormTextInput";
import PrimaryButton from "../components/PrimaryButton";

// NOTE: This screen is UI-only. No real auth calls are made.
// Hook it up later by calling your backend login endpoint from the submit handler.

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  const canSubmit = email.trim().length > 3 && password.trim().length >= 6;

  const handleSubmit = () => {
    // TODO: Integrate with backend login API here.
    // Example: await authService.login({ email, password })
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <BrandLogo />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Please enter your email id or password to Sign In
        </Text>

        <View style={styles.spacerLarge} />

        <FormTextInput
          label="Email ID"
          placeholder="Email ID"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={
            <MaterialIcons
              name="mail-outline"
              size={18}
              color={lagosColors.accent}
            />
          }
        />

        <View style={styles.spacerMedium} />

        <FormTextInput
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
          autoCapitalize="none"
          leftIcon={
            <MaterialIcons
              name="lock-outline"
              size={18}
              color={lagosColors.accent}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setSecure((s) => !s)}>
              <MaterialIcons
                name={secure ? "visibility-off" : "visibility"}
                size={20}
                color={lagosColors.textSecondary}
              />
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          style={styles.forgotRow}
          onPress={() => navigation?.navigate?.("ForgotPassword")}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>

        <View style={styles.spacerLarge} />

        <PrimaryButton
          title="Sign In"
          onPress={handleSubmit}
          disabled={!canSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: lagosColors.accent,
    textAlign: "center",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: lagosColors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  forgotRow: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  forgotText: {
    color: lagosColors.accent,
    fontWeight: "600",
  },
  spacerMedium: { height: 16 },
  spacerLarge: { height: 24 },
});

export default SignInScreen;
