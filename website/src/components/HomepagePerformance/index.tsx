import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import StylingBenchChart from '@site/src/components/StylingBenchChart';
import styles from './styles.module.css';

type TStat = {
  value: string;
  label: ReactNode;
};

// From benchmarks/styling/results/release-3.0.0, the same numbers as the chart.
const STATS: TStat[] = [
  {
    value: '7%',
    label: <>from hand-written StyleSheet on variant switches, level with twrnc</>,
  },
  {
    value: '2.2–2.6×',
    label: <>faster than NativeWind on every update</>,
  },
  {
    value: '4–8×',
    label: <>faster than Tamagui, with Tamagui's compiler on</>,
  },
];

export default function HomepagePerformance(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <Heading as="h2" className={styles.title}>
            Runtime tokens at hand-written speed
          </Heading>
          <p className={styles.lead}>
            Benchmarked against six React Native styling libraries in one run, every one
            rendering the same card with identical output.
          </p>
        </div>

        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.value} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.chart}>
          <StylingBenchChart />
        </div>

        <div className={styles.more}>
          <Link className="button button--secondary" to="/docs/performance">
            See every scenario and how it was measured
          </Link>
        </div>
      </div>
    </section>
  );
}
