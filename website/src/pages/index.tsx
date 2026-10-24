import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import {Box, Badge, Button, Text} from 'vajra-ui';
import ComponentPreview from '@site/src/components/ComponentPreview';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepagePerformance from '@site/src/components/HomepagePerformance';
import HomepageSetup from '@site/src/components/HomepageSetup';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const sample = `<Box p="s-4" gap="s-3" bg="surface" rounded="r-3">
  <Text variant="subheading">Hello</Text>
  <Badge label="New" bg="primary" />
  <Button label="Get started" onPress={() => {}} />
</Box>

// <Box bg="primry" />
// ✗ Type '"primry"' is not assignable. Did you mean '"primary"'?`;

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.badges}>
          <span className={styles.badge}>v3.0.0</span>
          <span className={styles.badge}>40+ components</span>
          <span className={styles.badge}>MIT, no Pro tier</span>
          <span className={styles.badge}>Benchmarked against 6 libraries</span>
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className={styles.heroLead}>Design tokens, not class strings.</p>
        <p className="hero__subtitle">
          A typed React Native design system. Style with props you already know, get 40+
          components out of the box, and switch themes live, with no compiler and no build step.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/showcase">
            Browse Components
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/performance">
            See Benchmarks
          </Link>
        </div>
        <div className={styles.heroPreview}>
          <div className={styles.codePreview}>
            <CodeBlock language="tsx" title="MyScreen.tsx">
              {sample}
            </CodeBlock>
          </div>
          <div className={styles.livePreview}>
            <ComponentPreview tall>
              <Box p="s-4" gap="s-3" bg="surface" rounded="r-3" align="flex-start" style={{width: 280}}>
                <Text variant="subheading">Hello</Text>
                <Badge label="New" bg="primary" />
                <Button label="Get started" onPress={() => {}} />
              </Box>
            </ComponentPreview>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepagePerformance />
        <HomepageSetup />
      </main>
    </Layout>
  );
}
