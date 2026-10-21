#!/usr/bin/env node
/**
 * Builds the report-card dashboard from the generated summaries of each platform:
 *
 *   full run (default)                    smoke run (--smoke)
 *   results/summary.json          Jest    results/smoke/summary.json
 *   results/ios/summary.json      iOS     results/smoke/ios/summary.json
 *   results/android/summary.json  Android results/smoke/android/summary.json
 *
 * Writes results/report-card.html, or results/smoke/smoke-test.html with --smoke.
 *
 * Run generate-report.js for each platform first (with or without `--smoke`, and with
 * `--platform ios|android` for the simulator/emulator runs). A platform without a summary is
 * left out of the card. Every number on the card comes from those files. Scenario B is left
 * out: its timings are at the resolution limit of the Jest timer.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SMOKE = process.argv.includes('--smoke');
const BASE = path.join(ROOT, 'results', SMOKE ? 'smoke' : '');
const OUT = path.join(BASE, SMOKE ? 'smoke-test.html' : 'report-card.html');

const SCENARIO_INFO = {
  'A-mount': { letter: 'A', name: 'A. Mount', desc: 'Render the cards.' },
  'C-variant-switch': { letter: 'C', name: 'C. Variant switch', desc: 'Change the card variant, one update per step.' },
  'D-theme-switch': { letter: 'D', name: 'D. Theme switch', desc: 'Switch between light and dark, one update per step.' },
  'E-combined': { letter: 'E', name: 'E. Combined', desc: 'Switch theme and variant together, one update per step.' },
};

const MEASURES_DEVICE =
  'Timed from setState to the end of the last commit, including Fabric and Yoga layout (Release, Hermes).';
const NOTE_DEVICE = kind =>
  `${kind}: a Release build on the real Fabric renderer, running on the host Mac’s CPU. Not a physical device, and not time to pixels.`;

const PLATFORMS = [
  {
    key: 'jest',
    dir: '',
    label: 'Jest',
    measures: 'Timed with act() around the update under react-test-renderer (development React).',
    note: 'Jest: JavaScript only, under react-test-renderer on the host. No native renderer.',
  },
  { key: 'ios', dir: 'ios', label: 'iOS simulator', measures: MEASURES_DEVICE, note: NOTE_DEVICE('Simulator') },
  { key: 'android', dir: 'android', label: 'Android emulator', measures: MEASURES_DEVICE, note: NOTE_DEVICE('Emulator') },
];

const round1 = n => Math.round(n * 10) / 10;

/** Scenario tabs. A mount at several card counts gets one tab per count. */
const scenarioList = summaries => {
  const seen = new Map();
  for (const summary of summaries) {
    for (const row of summary.rows) {
      const info = SCENARIO_INFO[row.scenario];
      if (!info) continue;
      const key = `${info.letter}-${row.count}`;
      if (!seen.has(key)) seen.set(key, { scenario: row.scenario, count: row.count, info });
    }
  }
  const mountCounts = [...seen.values()].filter(s => s.info.letter === 'A').length;
  return [...seen.entries()]
    .sort(([, a], [, b]) => a.info.letter.localeCompare(b.info.letter) || a.count - b.count)
    .map(([key, { scenario, count, info }]) => {
      const cards = `${count.toLocaleString('en-US')} cards`;
      return {
        key,
        scenario,
        count,
        tab: info.letter === 'A' && mountCounts > 1 ? `A · ${count.toLocaleString('en-US')}` : info.letter,
        name: `${info.name}, ${cards}`,
        desc: `${info.desc.replace('the cards', cards)}${info.letter === 'A' ? '' : ` ${cards}.`}`,
      };
    });
};

const loadPlatform = (p, scenarios) => {
  const dir = path.join(BASE, p.dir);
  const summary = JSON.parse(fs.readFileSync(path.join(dir, 'summary.json'), 'utf8'));
  const meta = summary.meta;

  const medians = {};
  for (const s of scenarios) {
    medians[s.key] = {};
    for (const row of summary.rows.filter(r => r.scenario === s.scenario && r.count === s.count)) {
      medians[s.key][row.label] = round1(row.medianMs);
    }
  }
  // A library passes when it produced every scenario. Each run aborts on its first failed
  // correctness check, so a missing scenario means a failure.
  const labels = [...new Set(summary.rows.map(r => r.label))];
  const passing = labels.filter(label => scenarios.every(s => medians[s.key][label] != null));

  const environment =
    (p.key === 'jest'
      ? `${meta.host.cpu}, Node ${meta.host.node}`
      : `${meta.host.device.replace(/ \([^)]*\)$/, '')}, ${meta.build.configuration}`) +
    ` · Vajra ${meta.versions.vajraUi}`;

  return {
    label: p.label,
    dir: path.relative(ROOT, dir) + '/',
    environment,
    collected: meta.collectedAt.slice(0, 10),
    options: meta.options,
    measures: p.measures,
    note: p.note,
    passing,
    medians,
  };
};

const runDescription = (options, scenarios) => {
  const mounts = scenarios.filter(s => s.scenario === 'A-mount').map(s => s.count.toLocaleString('en-US'));
  const update = scenarios.find(s => s.scenario !== 'A-mount');
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  return [
    `mount ${mounts.join(' / ')} cards`,
    update && `updates on ${update.count.toLocaleString('en-US')}`,
    `${plural(options.rounds, 'round')} × ${plural(options.trials, 'trial')}`,
    `${plural(options.warmup, 'warm-up')}`,
  ]
    .filter(Boolean)
    .join(' · ');
};

const main = () => {
  const available = PLATFORMS.filter(p => fs.existsSync(path.join(BASE, p.dir, 'summary.json')));
  if (available.length === 0) throw new Error(`No summaries under ${BASE}. Run generate-report.js first.`);

  const summaries = available.map(p => JSON.parse(fs.readFileSync(path.join(BASE, p.dir, 'summary.json'), 'utf8')));
  const scenarios = scenarioList(summaries);
  const platforms = Object.fromEntries(available.map(p => [p.key, loadPlatform(p, scenarios)]));
  const first = Object.values(platforms)[0];

  const data = {
    title: SMOKE ? 'Smoke test dashboard' : 'Benchmark report card',
    warning: SMOKE
      ? 'Smoke tests check that each library renders and updates correctly. With 3 trials, the timings are rough. Do not use them to rank libraries.'
      : 'Preliminary: one round per platform. Run-to-run variance is not measured yet, so treat differences under about 10% as ties.',
    winnersNote: SMOKE ? 'Based on 3 trials, so treat close results as ties.' : 'Based on one round, so treat close results as ties.',
    run: runDescription(first.options, scenarios),
    scenarios: scenarios.map(({ key, tab, name, desc }) => ({ key, tab, name, desc })),
    platforms,
  };

  const template = fs.readFileSync(path.join(__dirname, 'report-card-template.html'), 'utf8');
  const html = template
    .replace('__TITLE__', data.title)
    .replace('__CARD_DATA__', JSON.stringify(data, null, 2).replace(/</g, '\\u003c'));
  fs.writeFileSync(OUT, html);
  console.log(`Wrote ${path.relative(ROOT, OUT)} (${Object.keys(platforms).join(', ')}).`);
};

main();
