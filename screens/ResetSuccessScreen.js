import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";

const ResetSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons
          name="check-circle"
          size={80}
          color={lagosColors.success}
        />
        <View style={{ height: 24 }} />
        <Text style={styles.title}>Password Reset{"\n"}Successful</Text>
        <View style={{ height: 12 }} />
        <Text style={styles.subtitle}>
          Your password has been successfully{"\n"}changed.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: lagosColors.text,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: lagosColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default ResetSuccessScreen;
