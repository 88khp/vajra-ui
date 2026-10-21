/**
 * Metro configuration for the simulator/emulator benchmark app (see device/).
 *
 * NativeWind compiles global.css with tailwind.config.js at bundle time. The Jest harness
 * does the same thing at runtime in harness/prepare-implementation.ts.
 */
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), {}), {
  input: './global.css',
});
