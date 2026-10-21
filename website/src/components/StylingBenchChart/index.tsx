import React, { useState } from 'react';
import {
  BENCH_LIBRARIES,
  BENCH_SCENARIOS,
  type TBenchScenario,
} from '@site/src/data/styling-benchmark';
import styles from './styles.module.css';

const formatMs = (ms: number) => (ms >= 1000 ? ms.toLocaleString('en-US') : String(ms));

type TStylingBenchChartProps = {
  initialScenario?: TBenchScenario;
};

export default function StylingBenchChart({
  initialScenario = 'variant',
}: TStylingBenchChartProps): React.ReactElement {
  const [scenario, setScenario] = useState<TBenchScenario>(initialScenario);
  const active = BENCH_SCENARIOS.find((s) => s.id === scenario)!;
  const rows = [...BENCH_LIBRARIES].sort((a, b) => a.ms[scenario] - b.ms[scenario]);
  const max = rows[rows.length - 1].ms[scenario];
  const baseline = BENCH_LIBRARIES.find((l) => l.id === 'stylesheet')!.ms[scenario];

  return (
    <figure className={styles.wrapper}>
      <div className={styles.tabs} role="tablist" aria-label="Benchmark scenario">
        {BENCH_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === scenario}
            className={s.id === scenario ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setScenario(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className={styles.subtitle}>
        {active.description} · median ms for 100 cards · lower is faster
      </p>

      <ol className={styles.rows}>
        {rows.map((lib) => {
          const ms = lib.ms[scenario];
          const multiple = ms / baseline;
          const tip =
            lib.id === 'stylesheet'
              ? `${lib.label}: ${formatMs(ms)} ms (baseline)`
              : `${lib.label}: ${formatMs(ms)} ms, ${multiple.toFixed(2)}× StyleSheet`;

          return (
            <li key={lib.id} className={styles.row} title={tip}>
              <span className={lib.isVajra ? `${styles.label} ${styles.labelVajra}` : styles.label}>
                {lib.label}
              </span>
              <span className={styles.track}>
                <span
                  className={lib.isVajra ? `${styles.bar} ${styles.barVajra}` : styles.bar}
                  style={{ '--bench-fraction': Math.max(ms / max, 0.01) } as React.CSSProperties}
                />
                <span className={styles.value}>{formatMs(ms)} ms</span>
              </span>
            </li>
          );
        })}
      </ol>

      <figcaption className={styles.caption}>
        JavaScript-side timings under Jest, every library in the same run, each rendering the
        same card with identical output. Hover a row for its multiple of hand-written StyleSheet.
      </figcaption>
    </figure>
  );
}
