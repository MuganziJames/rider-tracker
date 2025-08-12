import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { lagosColors } from "../constants/mapStyles";

const OtpInput = ({ value, onChange, cellCount = 6 }) => {
  const inputs = useRef([]);

  const chars = (value || "").split("");

  const handleChange = (text, idx) => {
    const onlyDigit = text.replace(/\D/g, "");
    const next = Array.from({ length: cellCount }, (_, i) => chars[i] || "");
    next[idx] = onlyDigit.slice(-1);
    const combined = next.join("");
    onChange(combined);
    if (onlyDigit && idx < cellCount - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === "Backspace" && !chars[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: cellCount }).map((_, idx) => (
        <TextInput
          key={idx}
          ref={(r) => (inputs.current[idx] = r)}
          style={[styles.cell, chars[idx] ? styles.cellFilled : undefined]}
          value={chars[idx] || ""}
          onChangeText={(t) => handleChange(t, idx)}
          onKeyPress={(e) => handleKeyPress(e, idx)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          returnKeyType="next"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  cell: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F28B64",
    backgroundColor: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    color: lagosColors.text,
  },
  cellFilled: {
    borderColor: lagosColors.accent,
    borderWidth: 2,
  },
});

export default OtpInput;
