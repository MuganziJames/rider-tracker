import React, { useMemo, useState } from "react";
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
import FormTextInput from "../components/FormTextInput";
import PrimaryButton from "../components/PrimaryButton";
import PasswordCriteriaList from "../components/PasswordCriteriaList";

// UI-only placeholder for creating new password
const CreatePasswordScreen = ({ navigation, route }) => {
  const email = route?.params?.email || "";
  const code = route?.params?.code || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  const criteria = useMemo(
    () => ({
      length: password.length >= 8 && password.length <= 20,
      upperLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
      lettersNumbers: /[A-Za-z]/.test(password) && /\d/.test(password),
      special: /[@#!*$]/.test(password),
    }),
    [password]
  );

  const allValid = Object.values(criteria).every(Boolean);
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit = allValid && passwordsMatch;

  const handleSubmit = () => {
    // TODO: Integrate with backend: authService.resetPassword({ email, code, newPassword: password })
    navigation?.navigate?.("ResetSuccess");
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

        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Set your new password so you can Log In and access Resolve
        </Text>

        <View style={{ height: 24 }} />

        <FormTextInput
          label="New Password"
          placeholder="******"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure1}
          autoCapitalize="none"
          leftIcon={
            <MaterialIcons
              name="lock-outline"
              size={18}
              color={lagosColors.accent}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setSecure1((s) => !s)}>
              <MaterialIcons
                name={secure1 ? "visibility-off" : "visibility"}
                size={20}
                color={lagosColors.textSecondary}
              />
            </TouchableOpacity>
          }
        />

        <View style={{ height: 16 }} />

        <FormTextInput
          label="Confirm Password"
          placeholder="******"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={secure2}
          autoCapitalize="none"
          leftIcon={
            <MaterialIcons
              name="lock-outline"
              size={18}
              color={lagosColors.accent}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setSecure2((s) => !s)}>
              <MaterialIcons
                name={secure2 ? "visibility-off" : "visibility"}
                size={20}
                color={lagosColors.textSecondary}
              />
            </TouchableOpacity>
          }
        />

        <View style={{ height: 24 }} />

        <View style={{ height: 24 }} />
        <PasswordCriteriaList criteria={criteria} bulletsWhenFail />

        <View style={{ height: 24 }} />
        <PrimaryButton
          title="Sign Up"
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
    paddingBottom: 24,
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

export default CreatePasswordScreen;
