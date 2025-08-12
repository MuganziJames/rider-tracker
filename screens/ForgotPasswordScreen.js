import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";
import BrandLogo from "../components/BrandLogo";
import FormTextInput from "../components/FormTextInput";
import PrimaryButton from "../components/PrimaryButton";

// UI-only placeholder for requesting password reset
const ForgotPasswordScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route?.params?.email || "");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 5 && email.includes("@");

  const handleSubmit = async () => {
    // TODO: Integrate with backend: authService.requestPasswordReset(email)
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigation?.navigate?.("VerifyCode", { email });
    }, 500);
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
        <BrandLogo size="small" />

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Please enter your registered email address to reset your password
        </Text>

        <View style={{ height: 24 }} />

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

        <View style={{ height: 32 }} />

        <PrimaryButton
          title="Submit"
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          loading={submitting}
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
    fontSize: 22,
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
});

export default ForgotPasswordScreen;
