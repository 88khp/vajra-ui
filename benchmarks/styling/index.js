/**
 * Entry point of the simulator/emulator benchmark app.
 *
 * The commit hook must be installed before React Native loads its renderer, so it is the
 * first import.
 */
import './device/commit-hook';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './device/App';

AppRegistry.registerComponent(appName, () => App);
