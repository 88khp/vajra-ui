/**
 * Per-implementation runtime setup for the Jest harness.
 *
 * NativeWind resolves `className` through css-interop, which needs compiled CSS to be
 * registered before the first render. In a Metro build that happens at bundle time.
 * Under Jest we run the same Tailwind pipeline once per process, then register the
 * result. This is one-time setup and is never inside a measured render.
 */
import fs from 'fs';
import path from 'path';

import postcss from 'postcss';
import tailwind from 'tailwindcss';
import { cssToReactNativeRuntimeOptions } from 'nativewind/dist/metro/common';
import { registerCSS, setupAllComponents } from 'react-native-css-interop/test';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindConfig = require('../tailwind.config.js');

let nativeWindReady: Promise<void> | undefined;

const prepareNativeWind = (): Promise<void> => {
  nativeWindReady ??= (async () => {
    const source = path.join(__dirname, '../implementations/nativewind/benchmark-card.tsx');
    const { css } = await postcss([
      tailwind({
        ...tailwindConfig,
        content: [{ raw: fs.readFileSync(source, 'utf8'), extension: 'tsx' }],
      }),
    ]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
    setupAllComponents();
    registerCSS(css, cssToReactNativeRuntimeOptions);
  })();
  return nativeWindReady;
};

const PREPARERS: Record<string, () => Promise<void>> = {
  nativewind: prepareNativeWind,
};

/** Resolves once the implementation can render in Jest. A no-op for implementations that need nothing. */
export const prepareImplementation = (id: string): Promise<void> =>
  PREPARERS[id]?.() ?? Promise.resolve();
