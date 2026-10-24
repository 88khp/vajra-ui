import React from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VajraProvider } from 'vajra-ui';

import styles from './styles.module.css';

type TShowcaseCardProps = {
  name: string;
  href: string;
  children: React.ReactNode;
};

export default function ShowcaseCard({ name, href, children }: TShowcaseCardProps) {
  const { colorMode } = useColorMode();

  return (
    <Link to={href} className={styles.card}>
      <div className={styles.preview}>
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 0, height: 0 },
            insets: { top: 0, left: 0, right: 0, bottom: 0 },
          }}
        >
          <VajraProvider colorScheme={colorMode}>{children}</VajraProvider>
        </SafeAreaProvider>
      </div>
      <span className={styles.name}>{name}</span>
    </Link>
  );
}
