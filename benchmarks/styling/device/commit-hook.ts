/**
 * Records every React commit in the app, in release builds too.
 *
 * `Profiler.onRender` does not fire in production builds, so the device harness uses the
 * React DevTools global hook instead. React's production renderer calls
 * `onCommitFiberRoot` at the end of every commit, after layout effects. With Fabric, the
 * commit has already handed the new shadow tree to the native side and run Yoga layout
 * by then, so the timestamp covers React render, commit, and native layout.
 *
 * This module must load before React Native's renderer. index.js imports it first, and it
 * imports nothing itself. In debug builds React Native installs its own hook before the
 * entry point runs, so that hook is wrapped instead of replaced.
 */

export type TFiber = {
  tag: number;
  memoizedProps: Record<string, unknown> | null;
  child: TFiber | null;
  sibling: TFiber | null;
};

export type TFiberRoot = { current: TFiber };

export const commitLog: { count: number; lastAt: number; root: TFiberRoot | null } = {
  count: 0,
  lastAt: 0,
  root: null,
};

const record = (root: TFiberRoot) => {
  commitLog.count += 1;
  commitLog.lastAt = performance.now();
  commitLog.root = root;
};

type THook = {
  supportsFiber?: boolean;
  isDisabled?: boolean;
  onCommitFiberRoot?: (id: number, root: TFiberRoot, ...rest: unknown[]) => void;
  [key: string]: unknown;
};

const g = globalThis as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: THook };
const existing = g.__REACT_DEVTOOLS_GLOBAL_HOOK__;

if (existing) {
  const original = existing.onCommitFiberRoot;
  existing.onCommitFiberRoot = (id, root, ...rest) => {
    record(root);
    original?.call(existing, id, root, ...rest);
  };
} else {
  let nextId = 1;
  g.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true,
    isDisabled: false,
    renderers: new Map(),
    inject: () => nextId++,
    checkDCE: () => {},
    onScheduleFiberRoot: () => {},
    onCommitFiberRoot: (_id, root) => record(root),
    onCommitFiberUnmount: () => {},
    onPostCommitFiberRoot: () => {},
  };
}
