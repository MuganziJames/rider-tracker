import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { lagosColors } from "../constants/mapStyles";

const PrimaryButton = ({
  title,
  onPress,
  disabled,
  loading,
  outlined = false,
}) => {
  const isOutlined = disabled || outlined;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        isOutlined ? styles.buttonOutlined : styles.buttonFilled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isOutlined ? lagosColors.accent : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutlined ? styles.textOutlined : styles.textFilled,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 52,
    borderWidth: 1,
  },
  buttonFilled: {
    backgroundColor: "#F0692E",
    borderColor: "#F0692E",
  },
  buttonOutlined: {
    backgroundColor: "transparent",
    borderColor: "#F0692E",
  },
  text: {
    fontWeight: "700",
    fontSize: 16,
  },
  textFilled: {
    color: "#fff",
  },
  textOutlined: {
    color: "#F0692E",
  },
});

export default PrimaryButton;
