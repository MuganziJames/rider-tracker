import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";

const LocationSearchInput = ({
  placeholder = "Search location...",
  value = "",
  onLocationSelect,
  onTextChange,
  showCurrentLocationButton = false,
  onUseCurrentLocation,
  isActive = false,
  onFocus,
  onBlur,
}) => {
  const handleTextChange = (text) => {
    onTextChange(text);
  };

  const handleFocus = () => {
    onFocus();
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputContainer, isActive && styles.inputContainerActive]}
      >
        <MaterialIcons
          name="search"
          size={20}
          color={lagosColors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={onBlur}
          placeholderTextColor={lagosColors.textSecondary}
        />
        {showCurrentLocationButton && (
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={onUseCurrentLocation}
          >
            <MaterialIcons
              name="my-location"
              size={20}
              color={lagosColors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  inputContainerActive: {
    borderColor: lagosColors.primary,
    shadowOpacity: 0.15,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: lagosColors.text,
  },
  currentLocationButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default LocationSearchInput;
