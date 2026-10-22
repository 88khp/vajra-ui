/**
 * Jest config for the styling benchmark. Every implementation runs inside the React
 * Native Jest preset, so components render through the RN host-component layer
 * (View, Text, Pressable) and produce a host tree we can inspect.
 */
const path = require('path');

// `vajra-prev` runs the same Vajra card against an earlier version, installed under the
// @88khp/vajra-ui-prev and @88khp/vajra-core-prev aliases. One implementation runs per
// Jest process, so in that process both package names resolve to the earlier copies, and
// the earlier vajra-ui loads its own core rather than the hoisted current one.
const PREVIOUS_VAJRA = process.env.BENCH_IMPL === 'vajra-prev'
  ? {
      '^@88khp/vajra-ui$': path.join(__dirname, 'node_modules/@88khp/vajra-ui-prev/dist/index.js'),
      '^@88khp/vajra-core$': path.join(__dirname, 'node_modules/@88khp/vajra-core-prev/dist/index.js'),
    }
  : {};

module.exports = {
  rootDir: __dirname,
  preset: 'react-native',
  testEnvironment: 'node',
  // Tamagui ships ESM as .mjs, which the RN preset's transform pattern does not match.
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|@88khp/vajra-ui|@88khp/vajra-core|@88khp/vajra-icons|@88khp/vajra-ui-prev|@88khp/vajra-core-prev|lucide-react-native|styled-components|tamagui|@tamagui|nativewind|react-native-css-interop)/)',
  ],
  // Tamagui's exports map only selects its native ESM build under the 'react-native' condition.
  testEnvironmentOptions: {
    customExportConditions: ['react-native', 'require', 'default'],
  },
  moduleNameMapper: {
    ...PREVIOUS_VAJRA,
    '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
};
