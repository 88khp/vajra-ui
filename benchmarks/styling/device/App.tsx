/**
 * Simulator/emulator benchmark app.
 *
 * On launch it asks the host runner (scripts/run-device-benchmark.js) which implementation
 * to run, runs scenarios A–E for that one implementation, and posts the raw samples back.
 * The runner relaunches the app for every implementation, so global state from one
 * library (Tamagui's config, NativeWind's injected CSS) cannot leak into another, the
 * same isolation the Jest runner gets from one process per implementation.
 *
 * The iOS simulator reaches the host on localhost. The Android emulator does too, through
 * `adb reverse`, which the runner sets up.
 */
import React, { memo, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { findImplementation, TImplementationModule } from '../implementations';
import { TBenchCardData, TBenchVariant } from '../shared/spec';
import { prepareDeviceImplementation } from './prepare-implementation';
import { runScenarios, TBenchConfig, TControl, TState } from './run-scenarios';

// Must match PORT in scripts/run-device-benchmark.js.
const HOST = 'http://localhost:8099';

const noop = () => {};

const post = (route: string, body: object) =>
  fetch(`${HOST}/${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

/** The same Screen and Root as the Jest harness, minus the Profiler (it is off in release builds). */
const buildRoot = (impl: TImplementationModule) => {
  const { Provider, BenchmarkCard } = impl;

  const Screen = memo(function Screen({
    data,
    variant,
  }: {
    data: TBenchCardData[];
    variant: TBenchVariant | null;
  }) {
    return (
      <>
        {data.map(item => (
          <BenchmarkCard
            key={item.id}
            title={item.title}
            description={item.description}
            variant={variant ?? item.variant}
            onPrimaryPress={noop}
            onSecondaryPress={noop}
          />
        ))}
      </>
    );
  });

  const Root = ({ control }: { control: TControl }) => {
    const [state, setState] = useState<TState>({ data: null, theme: 'light', variant: null, tick: 0 });
    control.set = setState;
    control.current = state;

    return (
      <ScrollView style={styles.cards}>
        <Provider theme={state.theme}>
          <Text>{`tick ${state.tick}`}</Text>
          {state.data ? <Screen data={state.data} variant={state.variant} /> : null}
        </Provider>
      </ScrollView>
    );
  };

  return Root;
};

type TBench = { Root: ReturnType<typeof buildRoot>; control: TControl; config: TBenchConfig };

const App = () => {
  const [status, setStatus] = useState('Waiting for the host runner');
  const [bench, setBench] = useState<TBench | null>(null);

  // Load the implementation named by the runner.
  useEffect(() => {
    (async () => {
      try {
        const config: TBenchConfig = await (await fetch(`${HOST}/config`)).json();
        prepareDeviceImplementation(config.impl);
        const impl = findImplementation(config.impl).load();
        setBench({ Root: buildRoot(impl), control: { set: null, current: null }, config });
        setStatus(`${config.impl}: starting`);
      } catch (e) {
        setStatus(`Setup failed: ${String(e)}`);
        post('error', { message: String(e) }).catch(noop);
      }
    })();
  }, []);

  // Run once the Root has mounted and handed over its setState.
  useEffect(() => {
    if (!bench) return;
    (async () => {
      try {
        const samples = await runScenarios(bench.config, bench.control, label =>
          setStatus(`${bench.config.impl}: ${label}`),
        );
        await post('result', {
          impl: bench.config.impl,
          round: bench.config.round,
          trials: bench.config.trials,
          warmup: bench.config.warmup,
          steps: bench.config.steps,
          platform: Platform.OS,
          platformVersion: String(Platform.Version),
          collectedAt: new Date().toISOString(),
          samples,
        });
        setStatus(`${bench.config.impl}: done`);
      } catch (e) {
        setStatus(`${bench.config.impl} failed: ${String(e)}`);
        post('error', { impl: bench.config.impl, message: String(e) }).catch(noop);
      }
    })();
  }, [bench]);

  return (
    <View style={styles.app}>
      <Text style={styles.status}>{status}</Text>
      {bench ? <bench.Root control={bench.control} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  app: { flex: 1, paddingTop: 60, backgroundColor: '#ffffff' },
  status: { paddingHorizontal: 16, paddingBottom: 8, fontSize: 14, color: '#111111' },
  cards: { flex: 1 },
});

export default App;
