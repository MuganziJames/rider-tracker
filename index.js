import { registerRootComponent } from "expo";

// Show authentication flow first
import AuthNavigator from "./navigation/AuthNavigator";

// registerRootComponent calls AppRegistry.registerComponent('main', () => Component);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AuthNavigator);
