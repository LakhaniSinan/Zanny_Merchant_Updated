/**
 * @format
 */

// Reanimated must be imported at the very top to initialize the native runtime
// before any code that may create worklets runs.
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
