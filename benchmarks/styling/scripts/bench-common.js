/**
 * Helpers shared by the Jest runner (run-benchmark.js) and the simulator/emulator runner
 * (run-device-benchmark.js): option parsing, the seeded per-round shuffle, and the
 * environment details written to meta.json.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESULTS = path.join(ROOT, 'results');

const ALL_IMPLS = ['stylesheet', 'vajra', 'nativewind', 'tamagui', 'tamagui-compiled', 'styled-components', 'twrnc'];

// The Vajra packages under test, installed from npm.
const VAJRA_PKG = '@88khp/vajra-ui';
const VAJRA_CORE_PKG = '@88khp/vajra-core';

/** Parses `--key value` pairs. `--smoke` switches to the smoke defaults. `extra` adds string options. */
const parseArgs = (argv, extra = {}) => {
  const opts = { rounds: 3, trials: 30, warmup: 5, steps: 12, impls: ALL_IMPLS, ...extra };
  const flags = ['--smoke', '--no-build'];
  if (argv.includes('--smoke')) Object.assign(opts, { rounds: 1, trials: 3, warmup: 1, steps: 4 });
  const pairs = argv.filter(arg => !flags.includes(arg));
  for (let i = 0; i < pairs.length; i += 2) {
    const key = pairs[i].replace(/^--/, '');
    const value = pairs[i + 1];
    if (key === 'impls') opts.impls = value.split(',');
    else if (key in extra) opts[key] = value;
    else if (key in opts) opts[key] = Number(value);
    else throw new Error(`Unknown option --${key}`);
  }
  return opts;
};

/** mulberry32: a small, seedable PRNG. Used for the reproducible per-round shuffle. */
const mulberry32 = seed => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const shuffle = (items, seed) => {
  const rand = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/** The order of every round. Each round's seed is fixed, so the plan is reproducible. */
const orderPlan = opts =>
  Array.from({ length: opts.rounds }, (_, i) => ({ round: i + 1, order: shuffle(opts.impls, (i + 1) * 7919) }));

/** Removes earlier raw files for the implementations being run, so a subset run keeps the others. */
const clearRaw = (dir, impls) => {
  fs.mkdirSync(dir, { recursive: true });
  for (const file of fs.readdirSync(dir)) {
    const impl = file.replace(/^round-\d+-/, '').replace(/\.json$/, '');
    if (file.startsWith('round-') && impls.includes(impl)) fs.unlinkSync(path.join(dir, file));
  }
};

const readVersion = pkg => {
  try {
    return require(path.join(ROOT, 'node_modules', pkg, 'package.json')).version;
  } catch {
    return 'not installed';
  }
};

const sh = (cmd, cwd = ROOT) => spawnSync('sh', ['-c', cmd], { cwd, encoding: 'utf8' }).stdout.trim();

const gitState = () => {
  const repoRoot = path.resolve(ROOT, '..', '..');
  return {
    commit: sh('git rev-parse HEAD', repoRoot),
    uncommittedPaths: Number(sh('git status --porcelain | wc -l', repoRoot)),
  };
};

/** Where each Vajra package was installed from, and its integrity hash, read from yarn.lock. */
const vajraSource = () => {
  const lock = fs.readFileSync(path.join(ROOT, 'yarn.lock'), 'utf8');
  const entry = pkg => {
    const block = lock.split('\n\n').find(b => b.trimStart().startsWith(`"${pkg}@`));
    return {
      package: pkg,
      resolved: block?.match(/resolved "([^"]+)"/)?.[1],
      integrity: block?.match(/integrity (\S+)/)?.[1],
    };
  };
  // The earlier version, when installed under the -prev aliases for an A/B run.
  return [entry(VAJRA_PKG), entry(VAJRA_CORE_PKG), entry(`${VAJRA_PKG}-prev`), entry(`${VAJRA_CORE_PKG}-prev`)];
};

const collectMeta = (opts, device) => ({
  collectedAt: new Date().toISOString(),
  options: opts,
  host: {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpu: os.cpus()[0]?.model,
    cpuCount: os.cpus().length,
    totalMemGB: Number((os.totalmem() / 1024 ** 3).toFixed(1)),
    node: process.version,
    device: device ?? 'host machine (no physical device used; JS-side measurement)',
  },
  versions: {
    react: readVersion('react'),
    reactNative: readVersion('react-native'),
    reactTestRenderer: readVersion('react-test-renderer'),
    jest: readVersion('jest'),
    vajraUi: readVersion(VAJRA_PKG),
    vajraUiCore: readVersion(VAJRA_CORE_PKG),
    // The earlier version run as `vajra-prev`, when that alias is installed.
    vajraUiPrevious: readVersion('@88khp/vajra-ui-prev'),
    vajraUiCorePrevious: readVersion('@88khp/vajra-core-prev'),
    styledComponents: readVersion('styled-components'),
    tamagui: readVersion('tamagui'),
    nativewind: readVersion('nativewind'),
    tailwindcss: readVersion('tailwindcss'),
    reactNativeCssInterop: readVersion('react-native-css-interop'),
    twrnc: readVersion('twrnc'),
  },
  vajraSource: vajraSource(),
  repo: gitState(),
});

module.exports = { ROOT, RESULTS, ALL_IMPLS, parseArgs, orderPlan, clearRaw, sh, collectMeta };
