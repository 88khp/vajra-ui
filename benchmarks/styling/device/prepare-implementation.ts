/**
 * Per-implementation runtime setup for the device app. The counterpart of
 * harness/prepare-implementation.ts, which does the same for Jest.
 *
 * NativeWind needs its compiled CSS loaded before the first render. Metro compiles
 * global.css at bundle time (metro.config.js); requiring it here registers the result.
 * The require is inline, so other implementations never load NativeWind's CSS.
 */
const PREPARERS: Record<string, () => void> = {
  nativewind: () => require('../global.css'),
};

export const prepareDeviceImplementation = (id: string): void => PREPARERS[id]?.();
