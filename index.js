import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent ensures the app works correctly in both
// Expo Go and a bare React Native build, and on web via react-native-web.
registerRootComponent(App);
