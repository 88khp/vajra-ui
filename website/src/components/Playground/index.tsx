import React, { useMemo, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VajraProvider } from 'vajra-ui';

import styles from './styles.module.css';
import { TPlaygroundControls, TPlaygroundValues } from './types';

type TPlaygroundProps<TControls extends TPlaygroundControls> = {
  controls: TControls;
  /** Renders the live preview from the current control values. */
  render: (values: TPlaygroundValues<TControls>) => React.ReactNode;
  /** Renders the code snippet string from the current control values. */
  code: (values: TPlaygroundValues<TControls>) => string;
};

const defaultsFrom = <TControls extends TPlaygroundControls>(
  controls: TControls,
): TPlaygroundValues<TControls> => {
  const values = {} as TPlaygroundValues<TControls>;

  (Object.keys(controls) as Array<keyof TControls>).forEach(key => {
    values[key] = controls[key].default as TPlaygroundValues<TControls>[typeof key];
  });

  return values;
};

export default function Playground<TControls extends TPlaygroundControls>({
  controls,
  render,
  code,
}: TPlaygroundProps<TControls>) {
  const { colorMode } = useColorMode();
  const [values, setValues] = useState<TPlaygroundValues<TControls>>(() => defaultsFrom(controls));

  const setValue = <K extends keyof TControls>(key: K, value: TPlaygroundValues<TControls>[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const snippet = useMemo(() => code(values), [code, values]);

  return (
    <div className={styles.playground}>
      <div className={styles.preview}>
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 0, height: 0 },
            insets: { top: 0, left: 0, right: 0, bottom: 0 },
          }}
        >
          <VajraProvider colorScheme={colorMode}>{render(values)}</VajraProvider>
        </SafeAreaProvider>
      </div>

      <div className={styles.controls}>
        {(Object.keys(controls) as Array<keyof TControls>).map(key => {
          const control = controls[key];
          const name = String(key);

          if (control.type === 'select') {
            return (
              <label key={name} className={styles.control}>
                <span className={styles.controlLabel}>{control.label}</span>
                <select
                  className={styles.select}
                  value={values[key] as string}
                  onChange={e => setValue(key, e.target.value as TPlaygroundValues<TControls>[typeof key])}
                >
                  {control.options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          if (control.type === 'boolean') {
            return (
              <label key={name} className={styles.controlInline}>
                <input
                  type="checkbox"
                  checked={values[key] as boolean}
                  onChange={e =>
                    setValue(key, e.target.checked as TPlaygroundValues<TControls>[typeof key])
                  }
                />
                <span className={styles.controlLabel}>{control.label}</span>
              </label>
            );
          }

          return (
            <label key={name} className={styles.control}>
              <span className={styles.controlLabel}>{control.label}</span>
              <input
                type="text"
                className={styles.textInput}
                value={values[key] as string}
                onChange={e => setValue(key, e.target.value as TPlaygroundValues<TControls>[typeof key])}
              />
            </label>
          );
        })}
      </div>

      <CodeBlock language="tsx">{snippet}</CodeBlock>
    </div>
  );
}
