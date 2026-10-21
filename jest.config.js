module.exports = {
  preset: 'react-native',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@88khp/vajra-ui-core|@devraj-labs/vajra-ui-icons|lucide-react-native)/)',
  ],
  // lucide-react-native's "exports" lists a "react-native" condition ahead of
  // "require", which the RN jest preset's resolver picks first — pointing to its
  // ESM (.mjs) build even under require(). Map it to the CJS build directly.
  moduleNameMapper: {
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
};
