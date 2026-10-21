import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  icon: string;
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    icon: '🎯',
    title: 'Token-first',
    description: (
      <>
        Every prop (<code>bg</code>, <code>p</code>, <code>rounded</code>,{' '}
        <code>color</code>) maps to a design token, never a raw value — no magic
        hex codes or pixel values scattered through your app.
      </>
    ),
  },
  {
    icon: '🎨',
    title: 'Themeable',
    description: (
      <>
        Override colors, spacing, and border radii via{' '}
        <code>createVajraTheme</code>, add your own tokens through TypeScript
        module augmentation, and switch themes at runtime.
      </>
    ),
  },
  {
    icon: '🧬',
    title: 'Headless core',
    description: (
      <>
        Opinionated components are built on top of unstyled, headless
        primitives in <code>@88khp/vajra-ui-core</code> — use the
        styled layer, or drop down for full control.
      </>
    ),
  },
  {
    icon: '📦',
    title: '40 components',
    description: (
      <>
        Layout, forms, navigation, overlays, and feedback — Modal, Sheet,
        Toast, Select, Tabs, Accordion, and more, covering what a real app
        screen actually needs.
      </>
    ),
  },
  {
    icon: '⚡',
    title: 'Live previews',
    description: (
      <>
        Every component in these docs renders for real, in the browser, via
        react-native-web — not a static screenshot or a code snippet you have
        to imagine.
      </>
    ),
  },
  {
    icon: '✅',
    title: 'Tested & typed',
    description: (
      <>
        Full test coverage with Jest and React Native Testing Library, typed
        end-to-end token unions, and CI that verifies the published package
        is actually importable.
      </>
    ),
  },
];

function Feature({icon, title, description}: FeatureItem) {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className={styles.card}>
        <span className={styles.icon}>{icon}</span>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardBody}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
