import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";
import BrandLogo from "../components/BrandLogo";
import OtpInput from "../components/OtpInput";
import PrimaryButton from "../components/PrimaryButton";

// UI-only placeholder for verifying OTP
const VerifyCodeScreen = ({ navigation, route }) => {
  const email = route?.params?.email || "";
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(59);
  const timerRef = useRef(null);

  React.useEffect(() => {
    timerRef.current = setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(timerRef.current);
  }, []);

  const canSubmit = code.length === 6;

  const handleSubmit = () => {
    // TODO: Integrate with backend: authService.verifyResetCode({ email, code })
    navigation?.navigate?.("CreatePassword", { email, code });
  };

  const handleResend = () => {
    if (seconds === 0) {
      // TODO: call backend to resend
      setSeconds(59);
    }
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

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Please enter the 6-digit code we sent to your registered email
          address.
        </Text>

        <View style={styles.emailRow}>
          <Text style={styles.emailText}>{email}</Text>
          <TouchableOpacity
            onPress={() => navigation?.navigate?.("ForgotPassword", { email })}
            style={styles.editButton}
          >
            <MaterialIcons name="edit" size={18} color={lagosColors.accent} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
        <Text style={styles.label}>Verification code</Text>
        <OtpInput value={code} onChange={setCode} cellCount={6} />

        <View style={{ height: 28 }} />
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Submit"
            onPress={handleSubmit}
            disabled={!canSubmit}
          />
        </View>

        <View style={{ height: 12 }} />
        <TouchableOpacity onPress={handleResend} disabled={seconds > 0}>
          <Text style={styles.resendText}>
            Resend - 00:{String(seconds).padStart(2, "0")}
          </Text>
        </TouchableOpacity>
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
    alignItems: "center",
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
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  emailText: {
    fontWeight: "700",
    color: lagosColors.text,
    fontSize: 16,
  },
  editButton: {
    padding: 4,
  },
  label: {
    alignSelf: "flex-start",
    color: lagosColors.textSecondary,
    fontSize: 12,
    marginTop: 16,
    marginBottom: 6,
  },
  resendText: {
    color: lagosColors.textSecondary,
    fontSize: 12,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 0,
  },
});

export default VerifyCodeScreen;
