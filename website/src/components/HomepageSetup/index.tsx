import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const install = `npm install @88khp/vajra-ui @88khp/vajra-core react-native-safe-area-context`;

const provider = `import { VajraProvider } from '@88khp/vajra-ui';

export default function App() {
  return (
    <VajraProvider colorScheme="light">
      <YourApp />
    </VajraProvider>
  );
}`;

export default function HomepageSetup(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <Heading as="h2" className={styles.title}>
            Two steps to your first screen
          </Heading>
          <p className={styles.lead}>
            No Babel plugin, Metro config or CSS file to set up.
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <Heading as="h3" className={styles.stepTitle}>
              Install
            </Heading>
            <CodeBlock language="sh">{install}</CodeBlock>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <Heading as="h3" className={styles.stepTitle}>
              Wrap your app
            </Heading>
            <CodeBlock language="tsx" title="App.tsx">
              {provider}
            </CodeBlock>
          </div>
        </div>

        <div className={styles.more}>
          <Link className="button button--primary button--lg" to="/docs/installation">
            Read the setup guide
          </Link>
        </div>
      </div>
    </section>
  );
}
