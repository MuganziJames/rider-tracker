import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lagosColors } from "../constants/mapStyles";

const LocationSuggestions = ({
  suggestions = [],
  isVisible = false,
  onSuggestionPress,
  onSuggestionTouchStart,
  onSuggestionTouchEnd,
}) => {
  if (!isVisible || suggestions.length === 0) return null;

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => onSuggestionPress(item)}
      onPressIn={() => onSuggestionTouchStart && onSuggestionTouchStart()}
      onPressOut={() => onSuggestionTouchEnd && onSuggestionTouchEnd()}
      activeOpacity={0.7}
      delayPressIn={0}
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
    <View style={styles.suggestionsContainer}>
      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={(item) => item.place_id}
        style={styles.suggestionsList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default LocationSuggestions;
