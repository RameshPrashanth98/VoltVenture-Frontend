import { registerRootComponent } from 'expo';
import MapLibreGL from '@maplibre/maplibre-react-native';

import App from './App';

// OSM tiles require no API key — set access token to null
MapLibreGL.setAccessToken(null);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
