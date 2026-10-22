import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  icon: string;
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    icon: '🧠',
    title: 'Nothing new to learn',
    description: (
      <>
        Style with props: <code>bg="primary"</code>, <code>p="s-4"</code>,{' '}
        <code>rounded="r-3"</code>. No class vocabulary to memorise, and every
        prop maps to a React Native style, so what you write is what renders on
        iOS and Android.
      </>
    ),
  },
  {
    icon: '📦',
    title: 'Components included',
    description: (
      <>
        40+ components for real screens: Button, Input, Select, Modal, Sheet,
        Toast, Tabs, Accordion and more. Build each one once, with{' '}
        <code>createRecipe</code> for your own variants, instead of rebuilding
        the same button from class strings on every screen.
      </>
    ),
  },
  {
    icon: '🔌',
    title: 'No build step',
    description: (
      <>
        No Babel plugin, no Metro config, no CSS file, no compiler. Install
        the package, wrap your app in <code>VajraProvider</code>, and start
        building.
      </>
    ),
  },
  {
    icon: '⚡',
    title: 'Fast, with proof',
    description: (
      <>
        Level with twrnc on variant switches, 2.1–2.5× faster than NativeWind
        and 4–8× faster than Tamagui, in an open benchmark you can run
        yourself. <Link to="/docs/performance">See the numbers</Link>.
      </>
    ),
  },
  {
    icon: '🎯',
    title: 'Typed end to end',
    description: (
      <>
        Every token is a typed union, so <code>bg="primry"</code> fails at
        compile time with <em>Did you mean "primary"?</em> Your own tokens get
        the same autocomplete through module augmentation.
      </>
    ),
  },
  {
    icon: '🎨',
    title: 'Your brand, live theming',
    description: (
      <>
        Override colors, spacing, radii and fonts with{' '}
        <code>createVajraTheme</code>, and switch light and dark at runtime.
        Every component follows the theme, with nothing passed down by hand.
      </>
    ),
  },
  {
    icon: '🧬',
    title: 'Headless core',
    description: (
      <>
        Every styled component sits on unstyled primitives in{' '}
        <code>@88khp/vajra-core</code>. Use the design system, or drop down
        a level for full control.
      </>
    ),
  },
  {
    icon: '✅',
    title: 'Tested and previewed',
    description: (
      <>
        Covered by Jest and React Native Testing Library, and every component
        in these docs renders live in your browser through react-native-web.
      </>
    ),
  },
  {
    icon: '🆓',
    title: 'Free and MIT',
    description: (
      <>
        Every component is MIT licensed and free to use in any project. There
        is no Pro tier and nothing behind a paywall.
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
        <div className={styles.intro}>
          <Heading as="h2" className={styles.title}>
            A design system, not a styling dialect
          </Heading>
          <p className={styles.lead}>
            Utility classes give you a vocabulary. Vajra gives you the components,
            the tokens and the theme, typed and ready to ship.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
