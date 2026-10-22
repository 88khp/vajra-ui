import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

type TSeriesKey = 'view' | 'coreBox' | 'box';

type TDataPoint = {
  treeSize: number;
  view: number;
  coreBox: number;
  box: number;
};

// Median mount time (ms) from scripts/bench-box-layers.bench.tsx, measured on
// @88khp/vajra-ui 3.0.0 and @88khp/vajra-core 3.0.0.
const ABSOLUTE_DATA: TDataPoint[] = [
  { treeSize: 100, view: 1.0, coreBox: 1.0, box: 1.0 },
  { treeSize: 1000, view: 6.0, coreBox: 8.0, box: 8.0 },
  { treeSize: 5000, view: 34.0, coreBox: 47.0, box: 47.5 },
  { treeSize: 10000, view: 69.5, coreBox: 98.0, box: 99.5 },
  { treeSize: 20000, view: 162.0, coreBox: 221.5, box: 282.0 },
];

// Same runs, normalized to overhead per node (µs) vs Raw View — the number
// that actually answers "does the wrapper cost scale with tree size."
const PER_NODE_DATA: TDataPoint[] = ABSOLUTE_DATA.map((d) => ({
  treeSize: d.treeSize,
  view: 0,
  coreBox: ((d.coreBox - d.view) / d.treeSize) * 1000,
  box: ((d.box - d.view) / d.treeSize) * 1000,
}));

const SERIES: { key: TSeriesKey; label: string }[] = [
  { key: 'view', label: 'Raw View — react-native' },
  { key: 'coreBox', label: 'Box — @88khp/vajra-core 3.0.0 (headless)' },
  { key: 'box', label: 'Box — @88khp/vajra-ui 3.0.0 (theme tokens)' },
];

const PER_NODE_SERIES = SERIES.filter((s) => s.key !== 'view');

const CHART_WIDTH = 640;
const CHART_HEIGHT = 320;
const MARGIN = { top: 24, right: 16, bottom: 48, left: 56 };
const PLOT_WIDTH = CHART_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;
const GROUP_GAP = 24;
const BAR_GAP = 2;
const BAR_WIDTH = 18;

type TBarChartProps = {
  data: TDataPoint[];
  series: { key: TSeriesKey; label: string }[];
  maxValue: number;
  yTicks: number[];
  valueSuffix: string;
  ariaLabel: string;
};

function BarChart({
  data,
  series,
  maxValue,
  yTicks,
  valueSuffix,
  ariaLabel,
}: TBarChartProps): React.ReactElement {
  const [hovered, setHovered] = useState<{ group: number; series: TSeriesKey } | null>(null);

  const yScale = (value: number) => PLOT_HEIGHT - (value / maxValue) * PLOT_HEIGHT;
  const groupWidth = (PLOT_WIDTH - GROUP_GAP * (data.length - 1)) / data.length;
  const barsWidth = BAR_WIDTH * series.length + BAR_GAP * (series.length - 1);

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className={styles.svg} role="img" aria-label={ariaLabel}>
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={0} x2={PLOT_WIDTH} y1={yScale(tick)} y2={yScale(tick)} className={styles.gridline} />
            <text x={-10} y={yScale(tick)} className={styles.axisLabel} textAnchor="end" dy="0.32em">
              {tick}
            </text>
          </g>
        ))}

        {data.map((point, groupIndex) => {
          const groupX = groupIndex * (groupWidth + GROUP_GAP);
          const startX = groupX + (groupWidth - barsWidth) / 2;

          return (
            <g key={point.treeSize}>
              {series.map((s, seriesIndex) => {
                const value = point[s.key];
                const barX = startX + seriesIndex * (BAR_WIDTH + BAR_GAP);
                const barY = yScale(value);
                const barHeight = PLOT_HEIGHT - barY;
                const isHovered = hovered?.group === groupIndex && hovered.series === s.key;

                return (
                  <g
                    key={s.key}
                    onPointerEnter={() => setHovered({ group: groupIndex, series: s.key })}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered({ group: groupIndex, series: s.key })}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    className={styles.barGroup}
                  >
                    <rect x={barX} y={0} width={BAR_WIDTH} height={PLOT_HEIGHT} fill="transparent" />
                    <rect
                      x={barX}
                      y={barY}
                      width={BAR_WIDTH}
                      height={Math.max(barHeight, 0)}
                      rx={4}
                      className={`${styles.bar} ${styles[s.key]} ${isHovered ? styles.barHovered : ''}`}
                    />
                    {isHovered && (
                      <text x={barX + BAR_WIDTH / 2} y={barY - 8} textAnchor="middle" className={styles.valueLabel}>
                        {value.toFixed(1)}
                        {valueSuffix}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={groupX + groupWidth / 2} y={PLOT_HEIGHT + 24} textAnchor="middle" className={styles.axisLabel}>
                {point.treeSize.toLocaleString()}
              </text>
            </g>
          );
        })}

        <line x1={0} x2={PLOT_WIDTH} y1={PLOT_HEIGHT} y2={PLOT_HEIGHT} className={styles.axisLine} />
      </g>
    </svg>
  );
}

function Legend({ series }: { series: { key: TSeriesKey; label: string }[] }): React.ReactElement {
  return (
    <div className={styles.legend}>
      {series.map((s) => (
        <div key={s.key} className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles[s.key]}`} />
          <span className={styles.legendLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function PerfChart(): React.ReactElement {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <div className={styles.wrapper} data-theme-mode={colorMode}>
      <h4 className={styles.chartTitle}>Total mount time</h4>
      <Legend series={SERIES} />
      <BarChart
        data={ABSOLUTE_DATA}
        series={SERIES}
        maxValue={300}
        yTicks={[0, 75, 150, 225, 300]}
        valueSuffix="ms"
        ariaLabel="Bar chart comparing median total mount time in milliseconds for a raw View, vajra-core's Box and vajra-ui's Box across tree sizes of 100, 1000, 5000, 10000 and 20000 nodes. Values are listed in the table below the chart."
      />
      <p className={styles.caption}>
        Median total mount time (ms) — grows with tree size because there's more work overall.
      </p>

      <h4 className={styles.chartTitle}>Overhead per node vs Raw View</h4>
      <Legend series={PER_NODE_SERIES} />
      <BarChart
        data={PER_NODE_DATA}
        series={PER_NODE_SERIES}
        maxValue={8}
        yTicks={[0, 2, 4, 6, 8]}
        valueSuffix="µs"
        ariaLabel="Bar chart comparing per-node overhead in microseconds for vajra-core's Box and vajra-ui's Box relative to a raw View, across tree sizes of 100, 1000, 5000, 10000 and 20000 nodes. The overhead stays at 2 to 3 microseconds per node up to 10000 nodes and rises to 6 for vajra-ui's Box at 20000. Values are listed in the table below the chart."
      />
      <p className={styles.caption}>
        Flat at 2–3 µs per node up to 10,000 nodes. At 20,000 it rises to 6 µs for the token-aware
        Box, where a raw View's own cost per node grows too.
      </p>

      <p className={styles.caption}>
        Tree size = number of sibling nodes mounted at once · hover or focus a bar for the exact
        value · {isDark ? 'dark' : 'light'}-mode palette
      </p>
    </div>
  );
}
