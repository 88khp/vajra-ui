#!/usr/bin/env node
/**
 * Builds the benchmark report from raw measurements in results/raw/.
 * `--smoke` reads results/smoke/. `--platform ios|android` reads the simulator/emulator
 * runs from run-device-benchmark.js instead: results/<platform>/raw/, or
 * results/smoke/<platform>/ with `--smoke`.
 *
 * Writes:
 *   results/summary.json   every statistic, machine-readable
 *   results/summary.csv    one row per (scenario, count, implementation)
 *   results/dashboard.html static page; every number on it comes from summary.json
 *   REPORT.md              generated analysis: fastest per scenario, vs StyleSheet, uncertainty
 *
 * Statistics:
 *   median, p95 (nearest rank), mean, sample stdev, n
 *   95% CI of the median and of the relative difference vs StyleSheet, from a seeded
 *   bootstrap with 2,000 resamples.
 *   Relative improvement = ((baselineTime - candidateTime) / baselineTime) * 100
 *   A positive value means the candidate is faster.
 *
 * A difference is reported as "meaningful" only when its 95% CI excludes zero AND its
 * magnitude is at least MIN_MEANINGFUL_PCT. Otherwise it is reported as "within noise".
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
// `--smoke` reads and writes results/smoke/ (see run-benchmark.js --smoke).
const SMOKE = process.argv.includes('--smoke');
const platformArg = process.argv.indexOf('--platform');
const PLATFORM = platformArg === -1 ? '' : process.argv[platformArg + 1];
if (PLATFORM && !['ios', 'android'].includes(PLATFORM)) throw new Error('--platform must be ios or android');
const RESULTS = path.join(ROOT, 'results', SMOKE ? 'smoke' : '', PLATFORM);
const RAW = SMOKE ? RESULTS : path.join(RESULTS, 'raw');
const DEVICE_LABEL = { ios: 'iOS simulator', android: 'Android emulator' }[PLATFORM];
const BASELINE_ID = 'stylesheet';
// When a run includes `vajra-prev` (an earlier version via an alias), `vajra` rows also get
// `vsPrevious`: the same comparison as vsBaseline, against that earlier version.
const CURRENT_VAJRA_ID = 'vajra';
const PREVIOUS_VAJRA_ID = 'vajra-prev';
const BOOTSTRAP_RESAMPLES = 2000;
const MIN_MEANINGFUL_PCT = 5;

const IMPL_LABELS = {
  stylesheet: 'StyleSheet',
  vajra: 'VajraUI',
  'vajra-prev': 'VajraUI (previous)',
  nativewind: 'NativeWind',
  unistyles: 'Unistyles',
  tamagui: 'Tamagui',
  'tamagui-compiled': 'Tamagui (compiled)',
  'styled-components': 'StyledComponents',
  twrnc: 'twrnc',
};

const SCENARIO_LABELS = {
  'A-mount': 'A. Initial mount (React commit)',
  'B-rerender-unrelated': 'B. Re-render, styles unchanged',
  'C-variant-switch': 'C. Variant switching (per update)',
  'D-theme-switch': 'D. Theme switching (per update)',
  'E-combined': 'E. Combined theme + variant (per update)',
};

const mulberry32 = seed => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const sortedNumbers = values => [...values].sort((a, b) => a - b);

const median = values => {
  const s = sortedNumbers(values);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
};

const percentile = (values, p) => {
  const s = sortedNumbers(values);
  const rank = Math.ceil((p / 100) * s.length);
  return s[Math.min(s.length - 1, Math.max(0, rank - 1))];
};

const mean = values => values.reduce((a, b) => a + b, 0) / values.length;

const stdev = values => {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1));
};

/** 95% percentile-bootstrap CI for a statistic. Seeded so the report is reproducible. */
const bootstrapCI = (values, statistic, seed) => {
  if (values.length < 2) return [NaN, NaN];
  const rand = mulberry32(seed);
  const estimates = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const sample = Array.from({ length: values.length }, () => values[Math.floor(rand() * values.length)]);
    estimates.push(statistic(sample));
  }
  return [percentile(estimates, 2.5), percentile(estimates, 97.5)];
};

/** 95% bootstrap CI of the relative improvement of candidate vs baseline medians. */
const relativeImprovementCI = (baseline, candidate, seed) => {
  if (baseline.length < 2 || candidate.length < 2) return [NaN, NaN];
  const rand = mulberry32(seed);
  const pick = arr => Array.from({ length: arr.length }, () => arr[Math.floor(rand() * arr.length)]);
  const estimates = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const bm = median(pick(baseline));
    const cm = median(pick(candidate));
    estimates.push(((bm - cm) / bm) * 100);
  }
  return [percentile(estimates, 2.5), percentile(estimates, 97.5)];
};

const hashSeed = str => [...str].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

const loadRaw = () => {
  if (!fs.existsSync(RAW)) throw new Error(`No raw results at ${RAW}. Run scripts/run-benchmark.js first.`);
  const files = fs.readdirSync(RAW).filter(f => /^round-\d+-.+\.json$/.test(f));
  if (files.length === 0) throw new Error(`No round-*.json files in ${RAW}.`);
  return files.map(f => ({ file: path.join('raw', f), ...JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8')) }));
};

/**
 * Flattens every raw file into per-measurement records with a consistent shape:
 * { impl, scenario, count, round, ms, hostRerenders, commits, heapDeltaBytes, file }
 */
const flatten = files =>
  files.flatMap(file =>
    file.samples.map(s => ({
      impl: file.impl,
      round: file.round,
      file: file.file,
      scenario: s.scenario,
      count: s.count,
      ms: s.ms,
      hostRerenders: s.hostRerenders,
      commits: s.commits,
      heapDeltaBytes: s.heapDeltaBytes,
    })),
  );

/** Relative improvement of `ms` over `baseMs`, its 95% bootstrap CI, and the verdict. */
const compareTo = (baseMs, ms, seed) => {
  const relPct = ((median(baseMs) - median(ms)) / median(baseMs)) * 100;
  const ci = relativeImprovementCI(baseMs, ms, seed);
  const significant = ci[0] > 0 || ci[1] < 0;
  return {
    absoluteDiffMs: median(baseMs) - median(ms),
    relativeImprovementPct: relPct,
    relativeImprovementCI95Pct: ci,
    verdict:
      significant && Math.abs(relPct) >= MIN_MEANINGFUL_PCT
        ? relPct > 0
          ? 'faster'
          : 'slower'
        : 'within noise',
  };
};

const summarize = (records, impl, scenario, count, baseline, previous) => {
  const ms = records.map(r => r.ms).filter(v => typeof v === 'number');
  const rounds = [...new Set(records.map(r => r.round))].sort((a, b) => a - b);
  const perRoundMedian = rounds.map(rd => median(records.filter(r => r.round === rd).map(r => r.ms)));
  const hostRerenders = records.map(r => r.hostRerenders).filter(v => typeof v === 'number');
  const commits = records.map(r => r.commits).filter(v => typeof v === 'number');
  const heap = records.map(r => r.heapDeltaBytes).filter(v => typeof v === 'number');
  const seed = hashSeed(`${impl}|${scenario}|${count}`);

  const stats = {
    n: ms.length,
    rounds: rounds.length,
    medianMs: median(ms),
    p95Ms: percentile(ms, 95),
    meanMs: mean(ms),
    stdevMs: stdev(ms),
    medianCI95Ms: bootstrapCI(ms, median, seed),
    perRoundMedianMs: perRoundMedian,
    medianHostRerenders: hostRerenders.length ? median(hostRerenders) : undefined,
    medianCommits: commits.length ? median(commits) : undefined,
    medianHeapDeltaBytes: heap.length ? median(heap) : undefined,
  };

  if (baseline && impl !== BASELINE_ID) stats.vsBaseline = compareTo(baseline.map(r => r.ms), ms, seed + 1);
  // The installed Vajra against the previous version measured in the same run.
  if (previous && impl === CURRENT_VAJRA_ID) stats.vsPrevious = compareTo(previous.map(r => r.ms), ms, seed + 2);
  return stats;
};

const NOT_MEASURED_JEST = [
  'Native display timing (time until pixels are drawn) — needs a simulator or device build',
  'Scenario F: FlatList scrolling and frame timing — needs a native list on device',
  'Unistyles, all scenarios — needs its native runtime (simulator or device build)',
  'Bundle size, native binary size, build time — see README.md',
  'Native memory — JS heap only; no platform profiler',
  'Thermal state — no device',
  'Style-resolution time and allocation counts — not instrumented in this harness',
];

const NOT_MEASURED_DEVICE = [
  'UI-thread work after the commit: mounting native views and drawing pixels — needs a native profiler (Instruments, Perfetto)',
  'Scenario F: FlatList scrolling and frame timing — not implemented yet',
  'Unistyles, all scenarios — not wired into the device app yet',
  'JS heap delta — Hermes release builds expose no gc(), so before/after readings are not meaningful',
  'Bundle size, native binary size, build time — see README.md',
  'Native memory and thermal state — no platform profiler',
  `Physical-device timing — this is a ${DEVICE_LABEL}, which runs on the host Mac's CPU`,
];

// Vajra rows are labelled with the version that ran, so a run with two versions reads clearly.
const labelFor = (impl, meta) => {
  if (impl === CURRENT_VAJRA_ID && meta?.versions?.vajraUi) return `VajraUI ${meta.versions.vajraUi}`;
  if (impl === PREVIOUS_VAJRA_ID && meta?.versions?.vajraUiPrevious) return `VajraUI ${meta.versions.vajraUiPrevious}`;
  return IMPL_LABELS[impl] ?? impl;
};

const buildSummary = (raw, meta) => {
  const records = flatten(raw);
  const impls = [...new Set(raw.map(f => f.impl))];
  const groups = new Map();
  for (const r of records) {
    const key = `${r.scenario}|${r.count}`;
    if (!groups.has(key)) groups.set(key, { scenario: r.scenario, count: r.count, byImpl: new Map() });
    const g = groups.get(key);
    if (!g.byImpl.has(r.impl)) g.byImpl.set(r.impl, []);
    g.byImpl.get(r.impl).push(r);
  }

  const rows = [];
  for (const g of groups.values()) {
    const baseline = g.byImpl.get(BASELINE_ID);
    const previous = g.byImpl.get(PREVIOUS_VAJRA_ID);
    for (const impl of impls) {
      const recs = g.byImpl.get(impl);
      if (!recs || recs.length === 0) continue;
      rows.push({
        scenario: g.scenario,
        count: g.count,
        impl,
        label: labelFor(impl, meta),
        ...summarize(recs, impl, g.scenario, g.count, baseline, previous),
      });
    }
  }

  const fastestByGroup = [];
  for (const g of groups.values()) {
    const candidates = rows.filter(r => r.scenario === g.scenario && r.count === g.count);
    if (candidates.length === 0) continue;
    const best = candidates.reduce((a, b) => (b.medianMs < a.medianMs ? b : a));
    fastestByGroup.push({ scenario: g.scenario, count: g.count, impl: best.impl, medianMs: best.medianMs });
  }

  return {
    preliminary: true,
    preliminaryReason: PLATFORM
      ? `Release build on the ${DEVICE_LABEL} (Hermes, Fabric). Times run from setState to the end of the last React commit, including Yoga layout, not to pixels on screen. Not a physical device.`
      : 'JavaScript-side measurement under react-test-renderer on a host machine. No physical device or native display timing.',
    implementations: impls,
    rawFiles: raw.map(f => ({ file: f.file, impl: f.impl, round: f.round, samples: f.samples.length })),
    rows,
    fastestByGroup,
    notMeasured: PLATFORM ? NOT_MEASURED_DEVICE : NOT_MEASURED_JEST,
    definitions: {
      hostRerenders:
        'Host View/Text nodes whose props object is new after a commit. Comparable across libraries because all render the same host tree.',
      cardInvocations:
        'BenchmarkCard function calls. NOT comparable across libraries for context-driven updates (Vajra and Tamagui read the theme inside children).',
    },
  };
};

const fmt = (n, digits = 2) => (typeof n === 'number' && Number.isFinite(n) ? n.toFixed(digits) : 'n/a');
const fmtCI = ci => (Array.isArray(ci) && Number.isFinite(ci[0]) ? `[${fmt(ci[0])}, ${fmt(ci[1])}]` : 'n/a');
const fmtBytes = b => (typeof b === 'number' ? `${(b / 1024 / 1024).toFixed(2)} MB` : 'n/a');

const writeCsv = summary => {
  const header = [
    'scenario', 'count', 'implementation', 'n', 'rounds',
    'median_ms', 'p95_ms', 'mean_ms', 'stdev_ms', 'median_ci95_low_ms', 'median_ci95_high_ms',
    'median_host_rerenders', 'median_commits', 'median_heap_delta_bytes',
    'abs_diff_vs_stylesheet_ms', 'relative_improvement_pct', 'relative_ci95_low_pct', 'relative_ci95_high_pct', 'verdict',
  ];
  const lines = [header.join(',')];
  for (const r of summary.rows) {
    const v = r.vsBaseline;
    lines.push(
      [
        r.scenario, r.count, r.impl, r.n, r.rounds,
        fmt(r.medianMs, 4), fmt(r.p95Ms, 4), fmt(r.meanMs, 4), fmt(r.stdevMs, 4),
        fmt(r.medianCI95Ms[0], 4), fmt(r.medianCI95Ms[1], 4),
        r.medianHostRerenders ?? '', r.medianCommits ?? '', r.medianHeapDeltaBytes ?? '',
        v ? fmt(v.absoluteDiffMs, 4) : '', v ? fmt(v.relativeImprovementPct, 2) : '',
        v ? fmt(v.relativeImprovementCI95Pct[0], 2) : '', v ? fmt(v.relativeImprovementCI95Pct[1], 2) : '',
        v ? v.verdict : '',
      ].join(','),
    );
  }
  fs.writeFileSync(path.join(RESULTS, 'summary.csv'), lines.join('\n') + '\n');
};

const writeMarkdown = (summary, meta) => {
  const out = [];
  out.push(PLATFORM ? `# Styling benchmark report: ${DEVICE_LABEL}` : '# Styling benchmark report');
  out.push('');
  if (PLATFORM) {
    out.push(`> **PRELIMINARY.** Release build running on the ${DEVICE_LABEL}. Times run from setState to the end of`);
    out.push('> the last React commit (render, commit, shadow tree, Yoga layout). They do not include the UI thread');
    out.push('> mounting views or drawing pixels, and a simulator is not a physical device. See "Not measured" below.');
  } else {
    out.push('> **PRELIMINARY.** JavaScript-side measurements under react-test-renderer on a host machine.');
    out.push('> These are not device or native display timings. See "Not measured" below.');
  }
  out.push('');
  if (meta) {
    out.push('## Configuration');
    out.push('');
    out.push(`- Collected: ${meta.collectedAt}`);
    out.push(`- Host: ${meta.host.platform} ${meta.host.release} ${meta.host.arch}, ${meta.host.cpu} (${meta.host.cpuCount} logical CPUs, ${meta.host.totalMemGB} GB RAM), Node ${meta.host.node}`);
    if (PLATFORM) {
      out.push(`- Device: ${meta.host.device}`);
      if (meta.build) out.push(`- Build: ${Object.values(meta.build).join(', ')}`);
      out.push(`- Versions: react ${meta.versions.react}, react-native ${meta.versions.reactNative}`);
    } else {
      out.push(`- Versions: react ${meta.versions.react}, react-native ${meta.versions.reactNative}, react-test-renderer ${meta.versions.reactTestRenderer}, jest ${meta.versions.jest}`);
    }
    out.push(`- Styling libraries: vajra-ui ${meta.versions.vajraUi} (core ${meta.versions.vajraUiCore}), styled-components ${meta.versions.styledComponents}, tamagui ${meta.versions.tamagui}, nativewind ${meta.versions.nativewind}, twrnc ${meta.versions.twrnc} (tailwindcss ${meta.versions.tailwindcss}, css-interop ${meta.versions.reactNativeCssInterop})`);
    if (meta.vajraSource) {
      for (const src of meta.vajraSource) out.push(`- ${src.package}: \`${src.resolved}\`, \`${src.integrity}\``);
    } else {
      out.push(`- Vajra tarball: \`${meta.vajraTarball.file}\`, sha256 \`${meta.vajraTarball.sha256}\``);
    }
    out.push(`- Repository commit: \`${meta.repo.commit}\`; uncommitted paths at run time: ${meta.repo.uncommittedPaths}`);
    out.push(`- Options: ${meta.options.rounds} rounds, ${meta.options.trials} measured trials, ${meta.options.warmup} warm-up trials, ${meta.options.steps} steps per update trial`);
    out.push('');
  }

  const abRows = summary.rows.filter(r => r.vsPrevious);
  if (abRows.length) {
    const prev = id => summary.rows.find(r => r.impl === PREVIOUS_VAJRA_ID && r.scenario === id.scenario && r.count === id.count);
    const prevVersion = meta?.versions?.vajraUiPrevious ?? 'previous';
    out.push(`## Vajra UI ${meta?.versions?.vajraUi ?? 'current'} vs ${prevVersion} (same run)`);
    out.push('');
    out.push('Both versions ran in the same rounds, in shuffled order. Positive improvement means the current version is faster.');
    out.push('');
    out.push(`| Scenario | Count | ${prevVersion} median (ms) | ${meta?.versions?.vajraUi ?? 'Current'} median (ms) | Improvement (95% CI) | Verdict |`);
    out.push('|---|---|---|---|---|---|');
    for (const r of abRows) {
      const v = r.vsPrevious;
      out.push(`| ${SCENARIO_LABELS[r.scenario] ?? r.scenario} | ${r.count} | ${fmt(prev(r)?.medianMs, 3)} | ${fmt(r.medianMs, 3)} | ${fmt(v.relativeImprovementPct, 1)}% ${fmtCI(v.relativeImprovementCI95Pct)} | ${v.verdict} |`);
    }
    out.push('');
  }

  out.push('## Fastest implementation per scenario');
  out.push('');
  out.push('| Scenario | Count | Fastest | Median (ms) |');
  out.push('|---|---|---|---|');
  for (const f of summary.fastestByGroup) {
    out.push(`| ${SCENARIO_LABELS[f.scenario] ?? f.scenario} | ${f.count} | ${IMPL_LABELS[f.impl] ?? f.impl} | ${fmt(f.medianMs, 3)} |`);
  }
  out.push('');

  out.push('## Results');
  out.push('');
  out.push('Relative improvement is measured against StyleSheet with `((baseline − candidate) / baseline) × 100`. Positive means the candidate is faster. The verdict is "meaningful" only when the 95% CI excludes zero and |improvement| ≥ 5%.');
  out.push('');
  const groups = [...new Set(summary.rows.map(r => `${r.scenario}|${r.count}`))];
  for (const key of groups) {
    const [scenario, count] = key.split('|');
    const rows = summary.rows.filter(r => r.scenario === scenario && String(r.count) === count);
    out.push(`### ${SCENARIO_LABELS[scenario] ?? scenario}, ${count} cards`);
    out.push('');
    out.push('| Implementation | n | Median (ms) | 95% CI of median | p95 (ms) | vs StyleSheet | Improvement (95% CI) | Verdict | Host re-renders / update |');
    out.push('|---|---|---|---|---|---|---|---|---|');
    for (const r of rows) {
      const v = r.vsBaseline;
      out.push(
        `| ${r.label} | ${r.n} | ${fmt(r.medianMs, 3)} | ${fmtCI(r.medianCI95Ms)} | ${fmt(r.p95Ms, 3)} | ${v ? `${fmt(v.absoluteDiffMs, 3)} ms` : 'baseline'} | ${v ? `${fmt(v.relativeImprovementPct, 1)}% ${fmtCI(v.relativeImprovementCI95Pct)}` : '—'} | ${v ? v.verdict : '—'} | ${r.medianHostRerenders ?? 'n/a'} |`,
      );
    }
    out.push('');
  }

  out.push('## Not measured');
  out.push('');
  for (const item of summary.notMeasured) out.push(`- ${item}`);
  out.push('');
  out.push('## Definitions');
  out.push('');
  out.push(`- **Host re-renders:** ${summary.definitions.hostRerenders}`);
  out.push(`- **Card invocations:** ${summary.definitions.cardInvocations}`);
  out.push('');
  out.push('## Raw measurements');
  out.push('');
  out.push('Each raw file holds every sample for one implementation in one round. See `results/summary.csv` and `results/summary.json` for the aggregated numbers.');
  out.push('');
  for (const f of summary.rawFiles) out.push(`- \`${f.file}\` — ${f.impl}, round ${f.round}, ${f.samples} samples`);
  out.push('');
  fs.writeFileSync(path.join(RESULTS, 'REPORT.md'), out.join('\n'));
};

const DASHBOARD_TEMPLATE = fs.readFileSync(path.join(__dirname, 'dashboard-template.html'), 'utf8');

/**
 * Compiles the dashboard's Tailwind classes with the locally installed CLI, so the CSS is
 * inlined and the dashboard opens offline. Uses its own config, not the NativeWind one.
 */
const compileDashboardCss = () => {
  const input = path.join(os.tmpdir(), `dashboard-tailwind-${process.pid}.css`);
  fs.writeFileSync(input, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
  const result = spawnSync(
    path.join(ROOT, 'node_modules', '.bin', 'tailwindcss'),
    ['-c', path.join(__dirname, 'dashboard.tailwind.config.js'), '-i', input, '--minify'],
    { cwd: ROOT, encoding: 'utf8' },
  );
  fs.unlinkSync(input);
  if (result.status !== 0) throw new Error(`Tailwind build for the dashboard failed:\n${result.stderr}`);
  return result.stdout;
};

const writeDashboard = (summary, meta) => {
  const css = compileDashboardCss();
  const json = JSON.stringify({ ...summary, meta }).replace(/</g, '\\u003c');
  // Function replacers, so `$` sequences in the CSS or data are not treated as patterns.
  const html = DASHBOARD_TEMPLATE.replace('__TAILWIND_CSS__', () => css).replace('__SUMMARY_JSON__', () => json);
  fs.writeFileSync(path.join(RESULTS, 'dashboard.html'), html);
};

const main = () => {
  const raw = loadRaw();
  const metaPath = path.join(RESULTS, 'meta.json');
  const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : null;
  const summary = buildSummary(raw, meta);

  fs.writeFileSync(path.join(RESULTS, 'summary.json'), JSON.stringify({ ...summary, meta }, null, 2));
  writeCsv(summary);
  writeMarkdown(summary, meta);
  writeDashboard(summary, meta);
  console.log(`Wrote summary.json, summary.csv, dashboard.html, REPORT.md from ${raw.length} raw files.`);
};

main();
