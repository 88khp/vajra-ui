/**
 * The NativeWind Babel plugin rewrites React Native components so they accept
 * `className`. It is scoped to the NativeWind implementation only, so every other
 * implementation is compiled with the same plain preset.
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  overrides: [
    {
      test: /implementations[\\/]nativewind[\\/]/,
      presets: ['nativewind/babel'],
    },
  ],
};
