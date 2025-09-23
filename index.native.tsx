// index.native.tsx
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Reanimated must be imported at the top (after gesture-handler)
import 'react-native-reanimated';

import App from './App';
import { name as appName } from './app.json';

// Register main component
AppRegistry.registerComponent(appName, () => App);
