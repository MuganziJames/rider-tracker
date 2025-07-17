// Map styles and color constants
export const lagosColors = {
  primary: "#1E88E5",
  secondary: "#FFC107",
  accent: "#FF5722",
  background: "#F5F5F5",
  text: "#212121",
  textSecondary: "#757575",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
};

// Custom map style (minimal)
export const mapStyles = {
  minimal: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],
};
