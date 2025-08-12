import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";

// criteria: { length: bool, upperLower: bool, lettersNumbers: bool, special: bool }
// bulletsWhenFail: show bullet dot instead of tick for unmet
const PasswordCriteriaList = ({ criteria, bulletsWhenFail, style }) => {
  const rows = [
    { key: "length", text: "Length must between 8 to 20 character" },
    {
      key: "upperLower",
      text: "A combination of upper and lower case letters.",
    },
    { key: "lettersNumbers", text: "Contain letters and numbers" },
    { key: "special", text: "A special character such as @, #, !, * and $." },
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.header}>Password Policy:</Text>
      {rows.map((row) => {
        const passed = !!criteria?.[row.key];
        return (
          <View key={row.key} style={styles.row}>
            {passed ? (
              <MaterialIcons
                name="check-circle"
                size={16}
                color={lagosColors.success}
              />
            ) : (
              <View style={styles.bullet} />
            )}
            <Text style={[styles.text, passed && styles.textPassed]}>
              {row.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  header: {
    fontSize: 12,
    color: lagosColors.text,
    fontWeight: "700",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  text: {
    marginLeft: 8,
    fontSize: 12,
    color: lagosColors.textSecondary,
  },
  textPassed: {
    color: lagosColors.text,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: lagosColors.textSecondary,
  },
});

export default PasswordCriteriaList;
