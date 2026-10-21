#!/usr/bin/env node
/**
 * Runs scenarios A–E inside the benchmark app (device/) on the iOS simulator or the
 * Android emulator, once per implementation per round.
 *
 * - Builds the app in the Release configuration (Hermes, production React, bundled JS, no
 *   Metro) and installs it. Pass --no-build to reuse the installed build.
 * - Serves the run config over HTTP on PORT and collects each implementation's samples by
 *   POST. The app is terminated and relaunched for every implementation, so no library's
 *   global state can leak into another's numbers.
 * - Uses the same seeded per-round order as run-benchmark.js.
 * - Raw samples go to results/<platform>/raw/round-<r>-<impl>.json (smoke:
 *   results/smoke/<platform>/). Environment details, including the simulator or emulator,
 *   go to meta.json next to them.
 *
 * Usage: node scripts/run-device-benchmark.js --platform ios|android [--smoke] [--no-build]
 *          [--device <simulator UDID | adb serial>] [--rounds 3] [--trials 30] [--warmup 5]
 *          [--steps 12] [--impls stylesheet,vajra,...]
 *
 * iOS: uses the booted simulator, or the one named by --device. Run `pod install` in ios/
 * once first (the runner runs it when ios/Pods is missing).
 * Android: uses the running emulator (`adb devices`), or the serial named by --device.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const { ROOT, RESULTS, parseArgs, orderPlan, clearRaw, sh, collectMeta } = require('./bench-common');

// Must match HOST in device/App.tsx.
const PORT = 8099;
const APP_ID = 'com.vajra.stylingbench';
// A 100-card smoke run takes well under a minute per implementation. A full run with
// 2,000-card mounts takes much longer.
const RESULT_TIMEOUT_MS = 60 * 60 * 1000;
// The app fetches its config right after launch. Longer than this means it cannot reach the runner.
const REACH_TIMEOUT_MS = 90 * 1000;

const argv = process.argv.slice(2);
const SMOKE = argv.includes('--smoke');
const BUILD = !argv.includes('--no-build');
const opts = parseArgs(argv, { platform: '', device: '' });
if (!['ios', 'android'].includes(opts.platform)) throw new Error('--platform must be ios or android');

const RAW = SMOKE ? path.join(RESULTS, 'smoke', opts.platform) : path.join(RESULTS, opts.platform, 'raw');
const META_DIR = SMOKE ? RAW : path.join(RESULTS, opts.platform);

// The same card counts as the Jest harness (scenarios/bench.scenario.tsx).
const COUNTS = SMOKE
  ? { mountCounts: [100], updateCount: 100, rerenderCount: 100 }
  : { mountCounts: [200, 500, 2000], updateCount: 1000, rerenderCount: 1000 };

const run = (cmd, args, options = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...options });
  if (result.status !== 0) throw new Error(`${cmd} exited with ${result.status}`);
};

const quiet = (cmd, args) => spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8' });

// ---------- iOS simulator ----------

const ios = {
  device() {
    const { devices } = JSON.parse(quiet('xcrun', ['simctl', 'list', 'devices', '--json']).stdout);
    const all = Object.entries(devices).flatMap(([runtime, list]) => list.map(d => ({ ...d, runtime })));
    const sim = opts.device ? all.find(d => d.udid === opts.device) : all.find(d => d.state === 'Booted');
    if (!sim) throw new Error('No booted iOS simulator. Boot one, or pass --device <UDID>.');
    if (sim.state !== 'Booted') run('xcrun', ['simctl', 'boot', sim.udid]);
    const runtime = sim.runtime.replace('com.apple.CoreSimulator.SimRuntime.', '').replace(/-(\d+)-(\d+)$/, ' $1.$2');
    return { id: sim.udid, description: `${sim.name}, ${runtime} simulator (${sim.udid})` };
  },
  build(device) {
    if (!fs.existsSync(path.join(ROOT, 'ios', 'Pods'))) run('pod', ['install'], { cwd: path.join(ROOT, 'ios') });
    run('xcodebuild', [
      '-workspace', 'ios/StylingBench.xcworkspace',
      '-scheme', 'StylingBench',
      '-configuration', 'Release',
      '-sdk', 'iphonesimulator',
      '-destination', `id=${device.id}`,
      '-derivedDataPath', 'ios/build',
      // Release builds every simulator architecture by default. Only the booted one is needed.
      'ONLY_ACTIVE_ARCH=YES',
      'build',
    ]);
    run('xcrun', ['simctl', 'install', device.id, 'ios/build/Build/Products/Release-iphonesimulator/StylingBench.app']);
  },
  prepare() {},
  stop: device => quiet('xcrun', ['simctl', 'terminate', device.id, APP_ID]),
  launch: device => run('xcrun', ['simctl', 'launch', device.id, APP_ID]),
};

// ---------- Android emulator ----------

const adb = (device, args) => quiet('adb', [...(device ? ['-s', device.id] : []), ...args]);

const android = {
  device() {
    const serials = quiet('adb', ['devices']).stdout.split('\n').slice(1)
      .map(line => line.split('\t')).filter(([, state]) => state === 'device').map(([serial]) => serial);
    const id = opts.device || serials[0];
    if (!id || !serials.includes(id)) throw new Error('No running Android emulator. Start one, or pass --device <serial>.');
    const prop = name => adb({ id }, ['shell', 'getprop', name]).stdout.trim();
    const avd = adb({ id }, ['emu', 'avd', 'name']).stdout.split('\n')[0].trim();
    return {
      id,
      abi: prop('ro.product.cpu.abi'),
      description: `${avd || prop('ro.product.model')}, Android ${prop('ro.build.version.release')} (API ${prop('ro.build.version.sdk')}, ${prop('ro.product.cpu.abi')}) emulator (${id})`,
    };
  },
  build(device) {
    // Build only the emulator's ABI. The project default builds all four.
    run('./gradlew', ['assembleRelease', `-PreactNativeArchitectures=${device.abi}`], { cwd: path.join(ROOT, 'android') });
    run('adb', ['-s', device.id, 'install', '-r', 'android/app/build/outputs/apk/release/app-release.apk']);
  },
  // The emulator reaches the runner's server on its own localhost through this tunnel.
  prepare: device => run('adb', ['-s', device.id, 'reverse', `tcp:${PORT}`, `tcp:${PORT}`]),
  stop: device => adb(device, ['shell', 'am', 'force-stop', APP_ID]),
  launch: device => run('adb', ['-s', device.id, 'shell', 'am', 'start', '-n', `${APP_ID}/.MainActivity`]),
};

// ---------- Result server ----------

/** Serves the current config and resolves `waitForResult` when the app posts its samples. */
const createServer = () => {
  let config = null;
  let pending = null;
  let configServed = false;
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/config') {
      configServed = config !== null;
      res.writeHead(config ? 200 : 503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(config ?? { error: 'no run in progress' }));
      return;
    }
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      res.writeHead(200);
      res.end('ok');
      if (!pending) return;
      if (req.url === '/result') pending.resolve(JSON.parse(body));
      else if (req.url === '/error') pending.reject(new Error(`App reported: ${JSON.parse(body).message}`));
    });
  });
  return {
    listen: () => new Promise(resolve => server.listen(PORT, resolve)),
    close: () => server.close(),
    waitForResult(next) {
      config = next;
      configServed = false;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`No result for ${next.impl} after ${RESULT_TIMEOUT_MS} ms`)), RESULT_TIMEOUT_MS);
        // If the app cannot reach the runner, it cannot report that either. Fail fast instead.
        const reachTimer = setTimeout(() => {
          if (!configServed) {
            reject(new Error(`The app did not fetch its config within ${REACH_TIMEOUT_MS} ms. Is it able to reach localhost:${PORT}?`));
          }
        }, REACH_TIMEOUT_MS);
        const done = fn => value => {
          clearTimeout(timer);
          clearTimeout(reachTimer);
          pending = null;
          config = null;
          fn(value);
        };
        pending = { resolve: done(resolve), reject: done(reject) };
      });
    },
  };
};

const toolVersions = platform =>
  platform === 'ios'
    ? { xcode: sh('xcodebuild -version | head -1'), cocoapods: `CocoaPods ${sh('pod --version')}` }
    : { gradle: sh('cd android && ./gradlew --version | grep "^Gradle"'), java: sh('java -version 2>&1 | head -1') };

const main = async () => {
  const platform = opts.platform === 'ios' ? ios : android;
  const device = platform.device();
  console.log(`Device: ${device.description}`);
  if (BUILD) platform.build(device);
  platform.prepare(device);

  clearRaw(RAW, opts.impls);
  const server = createServer();
  await server.listen();

  const plan = orderPlan(opts);
  try {
    for (const { round, order } of plan) {
      console.log(`\n=== Round ${round}/${opts.rounds}: order ${order.join(' → ')}`);
      for (const impl of order) {
        platform.stop(device);
        const result = server.waitForResult({
          impl,
          round,
          trials: opts.trials,
          warmup: opts.warmup,
          steps: opts.steps,
          ...COUNTS,
        });
        platform.launch(device);
        const data = await result;
        platform.stop(device);
        const out = path.join(RAW, `round-${round}-${impl}.json`);
        fs.writeFileSync(out, JSON.stringify(data, null, 2));
        console.log(`${impl}: ${data.samples.length} samples → ${path.relative(ROOT, out)}`);
      }
    }
  } finally {
    server.close();
  }

  const { platform: _platform, device: _device, ...options } = opts;
  fs.writeFileSync(
    path.join(META_DIR, 'meta.json'),
    JSON.stringify(
      {
        ...collectMeta(options, device.description),
        runtime: opts.platform === 'ios' ? 'ios-simulator' : 'android-emulator',
        build: { configuration: 'Release', jsEngine: 'Hermes', architecture: 'New Architecture (Fabric)', ...toolVersions(opts.platform) },
        orderPlan: plan,
      },
      null,
      2,
    ),
  );
  console.log(`\nWrote ${opts.rounds * opts.impls.length} raw files to ${path.relative(ROOT, RAW)}`);
};

main().catch(e => {
  console.error(e);
  process.exit(1);
});
