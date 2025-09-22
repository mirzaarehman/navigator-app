// index.native.tsx
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

// Initialize reanimated early but safely
import 'react-native-reanimated';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.log('Registering app with name:', appName);

try {
    AppRegistry.registerComponent(appName, () => App);
    console.log('App registered successfully');
} catch (error) {
    console.error('Failed to register app:', error);
}
