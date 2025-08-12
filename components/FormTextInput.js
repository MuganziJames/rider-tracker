import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { lagosColors } from "../constants/mapStyles";

const FormTextInput = ({
  label,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.textInput, inputStyle]}
          placeholderTextColor={lagosColors.textSecondary}
          {...props}
        />
        {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 12,
    color: lagosColors.accent,
    marginBottom: 6,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F28B64",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    minHeight: 56,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: lagosColors.text,
    paddingVertical: 0,
  },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 10 },
});

export default FormTextInput;
