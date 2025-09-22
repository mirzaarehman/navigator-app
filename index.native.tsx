// index.native.tsx
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';

// Initialize reanimated
import 'react-native-reanimated';

console.log('Registering app with name:', appName);

try {
    AppRegistry.registerComponent(appName, () => App);
    console.log('App registered successfully');
} catch (error) {
    console.error('Failed to register app:', error);
}
