import path from 'path';

import type { Plugin } from '@docusaurus/types';

/**
 * Aliases react-native -> react-native-web so vajra-ui components (which
 * import from react-native all the way down through @88khp/vajra-core)
 * can render in the browser for the live component playground.
 */
export default function reactNativeWebPlugin(): Plugin {
  return {
    name: 'react-native-web-webpack-plugin',
    configureWebpack() {
      return {
        // Docusaurus merges plugin webpack config with webpack-merge, which
        // concatenates arrays (appends) by default — without "prepend" here,
        // resolve.extensions below would land after Docusaurus's own
        // defaults, so ".web.tsx" would never actually win priority over
        // plain ".tsx" and react-native-web's platform-specific files
        // (SafeAreaView.web.tsx etc.) would never get picked up.
        mergeStrategy: { 'resolve.extensions': 'prepend' },
        resolve: {
          alias: {
            'react-native$': 'react-native-web',
            // vajra-ui is symlinked in (see scripts/link-vajra-ui.sh), so
            // its internal `import ... from 'react-native-safe-area-context'`
            // resolves by walking up from the symlink's real filesystem
            // location and finds the repo root's copy — a SEPARATE install
            // from website's own react-native-safe-area-context dependency.
            // Two separate module instances means two separate React
            // contexts, so SafeAreaProvider (from website's copy) and
            // useSafeAreaInsets (from vajra-ui's resolved copy) never see
            // each other. Force both to the same physical install.
            'react-native-safe-area-context$': path.resolve(
              __dirname,
              '../node_modules/react-native-safe-area-context',
            ),
            // vajra-ui's own node_modules also has @88khp/vajra-core
            // installed (it's vajra-ui's peer dependency too) — resolution
            // from files under the symlink walks up and finds THAT copy
            // first, shadowing website's own (possibly locally-linked, see
            // scripts/link-vajra-ui.sh) copy. Force everything to the one
            // physical install website itself depends on.
            '@88khp/vajra-core$': path.resolve(
              __dirname,
              '../node_modules/@88khp/vajra-core',
            ),
          },
          // .web.js/.web.tsx first so packages that ship a browser-safe
          // variant (react-native-safe-area-context's
          // NativeSafeAreaProvider.web.js, avoiding its TurboModuleRegistry
          // native path) get picked up automatically.
          extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
          // vajra-ui is symlinked into website/node_modules (see
          // scripts/link-vajra-ui.sh) rather than installed normally.
          // Webpack's default resolve.symlinks:true follows the symlink to
          // its real path and resolves react-native from there — landing on
          // the actual react-native package at the repo root instead of the
          // aliased react-native-web in website/node_modules. Disabling
          // symlink-following keeps resolution scoped to website/node_modules,
          // where the alias above applies.
          symlinks: false,
        },
        module: {
          rules: [
            {
              // vajra-ui's dist/ output is compiled with jsx: "react-native"
              // (JSX left untransformed, meant for a downstream RN bundler)
              // — webpack's default rules skip node_modules, so JSX there
              // never gets transformed. Run it through babel here instead.
              test: /\.jsx?$/,
              include: [/node_modules\/vajra-ui/, /node_modules\/@88khp\/vajra-core/],
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  presets: [require.resolve('@babel/preset-react')],
                },
              },
            },
          ],
        },
      };
    },
  };
}
