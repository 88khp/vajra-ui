#!/usr/bin/env node
/**
 * Writes implementations/tamagui/theme-values.json from Vajra's default theme.
 *
 * Tamagui's compiler evaluates tamagui.config in Node at build time. shared/spec.ts
 * reads its values from the full @88khp/vajra-ui entry, which pulls in React Native
 * libraries Node cannot run. This snapshot holds the same numbers (colors, typography,
 * sizes) without that import. The parity suite still checks that every implementation,
 * Tamagui included, renders exactly the spec's styles, so any drift fails it.
 *
 * Usage: node scripts/snapshot-tamagui-theme.js
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');
const THEME = path.join(ROOT, 'node_modules/@88khp/vajra-ui/dist/ui/vajra-theme/vajra-theme.js');
const OUT = path.join(ROOT, 'implementations/tamagui/theme-values.json');

const { outputFiles } = esbuild.buildSync({
  entryPoints: [THEME],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
});
const mod = { exports: {} };
new Function('module', 'exports', 'require', outputFiles[0].text)(mod, mod.exports, require);
const theme = mod.exports.defaultVajraTheme;
if (!theme) throw new Error('defaultVajraTheme not found in vajra-theme.js');

// Read by spec-free code only; mirrors the values shared/spec.ts derives from the theme.
const pick = t => ({ fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight });
const snapshot = {
  colors: { light: theme.light.colors, dark: theme.dark.colors },
  typography: {
    title: pick(theme.light.typography.h3),
    description: pick(theme.light.typography.body),
    button: pick(theme.light.typography.button),
  },
};
fs.writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`wrote ${path.relative(ROOT, OUT)}`);
