import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePerformance from '@site/src/components/HomepagePerformance';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const sample = `<Box p="s-4" gap="s-3">
  <Text variant="subheading">Hello</Text>
  <Badge label="New" bg="primary" />
  <Button label="Get started" onPress={() => {}} />
</Box>`;

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.badges}>
          <span className={styles.badge}>v3.0.0</span>
          <span className={styles.badge}>40+ components</span>
          <span className={styles.badge}>Benchmarked against 6 libraries</span>
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/components/box">
            Browse Components
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/performance">
            See Benchmarks
          </Link>
        </div>
        <div className={styles.codePreview}>
          <CodeBlock language="tsx" title="MyScreen.tsx">
            {sample}
          </CodeBlock>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A minimal, token-driven React Native component library.">
      <HomepageHeader />
      <main>
        <HomepagePerformance />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
