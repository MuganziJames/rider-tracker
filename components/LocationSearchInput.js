import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";
import { searchPlaces, getPlaceDetails } from "../utils/googleMaps";

const LocationSearchInput = ({
  placeholder = "Search location...",
  value = "",
  onLocationSelect,
  onTextChange,
  showCurrentLocationButton = false,
  onUseCurrentLocation,
  isActive = false,
  onFocus,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  const handleTextChange = (text) => {
    onTextChange(text);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search
    searchTimeout.current = setTimeout(async () => {
      if (text.trim().length >= 2) {
        setIsLoading(true);
        const result = await searchPlaces(text);
        if (result.success) {
          setSuggestions(result.predictions);
          setShowSuggestions(true);
        }
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  const handleSuggestionPress = async (prediction) => {
    setIsLoading(true);
    setShowSuggestions(false);

    const placeDetails = await getPlaceDetails(prediction.place_id);
    if (placeDetails.success) {
      onLocationSelect({
        location: placeDetails.location,
        address: placeDetails.address,
        name: placeDetails.name,
      });
      onTextChange(placeDetails.address);
    }
    setIsLoading(false);
  };

  const handleFocus = () => {
    onFocus();
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <MaterialIcons
        name="location-on"
        size={20}
        color={lagosColors.textSecondary}
        style={styles.suggestionIcon}
      />
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionMainText} numberOfLines={1}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        <Text style={styles.suggestionSecondaryText} numberOfLines={1}>
          {item.structured_formatting?.secondary_text || ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          onBlur={() => {
            // Delay hiding suggestions to allow taps
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          placeholderTextColor={lagosColors.textSecondary}
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={lagosColors.primary}
            style={styles.loadingIcon}
          />
        )}
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

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
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
    borderRadius: 12,
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
  loadingIcon: {
    marginLeft: 8,
  },
  currentLocationButton: {
    marginLeft: 8,
    padding: 4,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 200,
    zIndex: 1001,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 16,
    color: lagosColors.text,
    fontWeight: "500",
  },
  suggestionSecondaryText: {
    fontSize: 12,
    color: lagosColors.textSecondary,
    marginTop: 2,
  },
});

export default LocationSearchInput;
