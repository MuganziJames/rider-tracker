# 🚀 Smart Rider Tracking App

A comprehensive React Native (Expo) application for logistics riders in Nigeria, featuring real-time GPS tracking, Google Maps integration, WebSocket communication, and dynamic ETA calculations.

## ✨ Features

- 📍 **Real-time GPS tracking** with high accuracy
- 🗺️ **Google Maps integration** with route visualization
- 🔌 **WebSocket communication** for live updates
- ⏱️ **Dynamic ETA calculation** using Google Distance Matrix API
- 🛣️ **Route planning** with Google Directions API
- 📡 **Auto-reconnecting WebSocket** with exponential backoff
- 🎯 **Delivery point markers** and navigation
- 📊 **Live status panel** showing connection and location info
- 🔄 **Automatic location updates** every 7 seconds
- 📱 **Responsive UI** with loading states and error handling

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the project root:

```env
# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# WebSocket Server Configuration
WS_URL=ws://your-server-ip:3000

# App Configuration
LOCATION_UPDATE_INTERVAL=7000
ETA_UPDATE_INTERVAL=30000
```

### 2. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Directions API
   - Distance Matrix API
4. Create credentials (API Key)
5. Restrict the API key:
   - **Package name:** `com.logisticshub.rider`
   - **SHA-1 fingerprint:** `0B:F7:32:01:42:54:9B:68:7A:D5:02:94:C5:DD:70:D0:25:A6:78:E1`

### 3. Update App Configuration

Edit `app.json` to add your API key:

```json
{
  "expo": {
    "extra": {
      "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY",
      "wsUrl": "ws://your-server-ip:3000"
    }
  }
}
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📱 Usage

1. **Location Permission**: App will request location access on startup
2. **Map Display**: Shows your current location with a blue marker
3. **Destination**: Red marker shows the delivery destination
4. **Route**: Blue polyline shows the optimal route
5. **Status Panel**: Top overlay shows connection status, GPS coordinates, and ETA
6. **WebSocket**: Automatically sends location updates every 7 seconds
7. **ETA Updates**: Refreshes every 30 seconds with traffic data

## 🏗️ Project Structure

```
rider-tracker/
├── components/
│   ├── LoadingSpinner.js     # Loading state component
│   ├── ErrorDisplay.js      # Error handling component
│   └── StatusPanel.js       # Status overlay component
├── hooks/
│   ├── useLocation.js       # Location management hook
│   └── useWebSocket.js      # WebSocket communication hook
├── utils/
│   └── googleMaps.js        # Google Maps API utilities
├── constants/
│   └── config.js            # App configuration constants
├── App.js                   # Main application component
├── .env                     # Environment variables
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## 🔧 Configuration Options

### Location Updates
- **Interval**: 7 seconds (configurable in `constants/config.js`)
- **Accuracy**: High accuracy GPS
- **Distance threshold**: 10 meters

### WebSocket
- **Auto-reconnect**: Yes, with exponential backoff
- **Max reconnect attempts**: 5
- **Reconnect interval**: 5 seconds (increasing)

### ETA Updates
- **Interval**: 30 seconds
- **Traffic consideration**: Yes, uses real-time traffic data
- **Mode**: Driving mode optimized for delivery

## 📡 WebSocket Message Format

### Outgoing (Rider → Server)
```json
{
  "type": "location_update",
  "timestamp": "2025-07-14T19:30:00.000Z",
  "rider_id": "rider_001",
  "location": {
    "latitude": 6.5244,
    "longitude": 3.3792,
    "accuracy": 5.0,
    "speed": 12.5,
    "heading": 45.0
  }
}
```

### Incoming (Server → Rider)
The app logs all incoming messages to console. Common message types:
- Delivery assignments
- Route updates
- Emergency alerts
- Status confirmations

## 🚨 Error Handling

- **Location Permission Denied**: Shows retry option
- **No Internet Connection**: Graceful degradation
- **WebSocket Disconnection**: Automatic reconnection
- **API Rate Limits**: Error logging and fallback
- **Invalid Coordinates**: Input validation

## 🔒 Security Features

- Environment variables for sensitive data
- API key restrictions by package name and SHA-1
- No hardcoded secrets in source code
- Secure WebSocket connections recommended

## 🌍 Nigeria-Specific Optimizations

- **Default coordinates**: Lagos, Nigeria
- **Traffic optimization**: Lagos traffic patterns
- **Delivery zones**: Nigerian urban areas
- **Currency**: Naira (for future features)

## 🚀 Performance Features

- **Efficient location tracking**: Only updates when significant movement
- **Debounced API calls**: Prevents excessive API usage
- **Memory optimization**: Proper cleanup on unmount
- **Battery optimization**: Balanced location accuracy vs battery usage

## 🔄 Development Workflow

1. **Development**: Use Expo Go for rapid testing
2. **Testing**: Test on both Android and iOS
3. **Building**: Use EAS Build for production builds
4. **Deployment**: Submit to app stores

## 📝 TODO / Future Enhancements

- [ ] Authentication and rider profiles
- [ ] Multiple delivery stops support
- [ ] Offline mode capabilities
- [ ] Push notifications
- [ ] Delivery proof (photos, signatures)
- [ ] Analytics and reporting
- [ ] Voice navigation
- [ ] Dark mode support
- [ ] Multiple language support

## 🐛 Troubleshooting

### Common Issues

1. **"Unable to resolve react-native-maps"**
   - Run: `npx expo install react-native-maps`

2. **"Location permission denied"**
   - Check device settings for location permissions

3. **"WebSocket connection failed"**
   - Verify WebSocket server is running
   - Check network connectivity

4. **"Google Maps not loading"**
   - Verify API key is correct
   - Check API restrictions
   - Ensure required APIs are enabled

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for Nigerian logistics riders
