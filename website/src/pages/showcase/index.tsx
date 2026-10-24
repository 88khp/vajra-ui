import React, { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  Card,
  Chip,
  DatePicker,
  Fab,
  IconBox,
  IconButton,
  Input,
  Pagination,
  ProgressBar,
  Radio,
  Rating,
  Row,
  Searchbar,
  Select,
  Skeleton,
  Spinner,
  Stepper,
  Switch,
  TabBar,
  Text,
  TimePicker,
  Tooltip,
} from 'vajra-ui';
import { BellIcon, CheckIcon, PlusIcon, StarIcon } from '@88khp/vajra-icons';
import ShowcaseCard from '@site/src/components/ShowcaseCard';

import styles from './styles.module.css';

const items: { name: string; href: string; render: () => ReactNode }[] = [
  { name: 'Button', href: '/docs/components/button', render: () => <Button label="Button" onPress={() => {}} /> },
  { name: 'IconButton', href: '/docs/components/icon-button', render: () => <IconButton icon={BellIcon} onPress={() => {}} /> },
  { name: 'FAB', href: '/docs/components/fab', render: () => <Fab icon={PlusIcon} onPress={() => {}} /> },
  { name: 'Input', href: '/docs/components/input', render: () => <Input.Outline placeholder="Email" /> },
  { name: 'Searchbar', href: '/docs/components/searchbar', render: () => <Searchbar placeholder="Search…" onChangeText={() => {}} /> },
  { name: 'Select', href: '/docs/components/select', render: () => <Select options={[{ label: 'One', value: '1' }]} value="1" onChange={() => {}} /> },
  { name: 'DatePicker', href: '/docs/components/date-picker', render: () => <DatePicker value={new Date(2026, 0, 15)} onChange={() => {}} /> },
  { name: 'TimePicker', href: '/docs/components/time-picker', render: () => <TimePicker value={{ hour: 14, minute: 30 }} onChange={() => {}} /> },
  { name: 'Switch', href: '/docs/components/switch', render: () => <Switch value onChange={() => {}} /> },
  { name: 'Radio', href: '/docs/components/radio', render: () => <Radio.Root value="a" onChange={() => {}}><Radio.Item value="a" label="Option" /></Radio.Root> },
  { name: 'Stepper', href: '/docs/components/stepper', render: () => <Stepper value={3} onChange={() => {}} min={0} max={10} /> },
  { name: 'Rating', href: '/docs/components/rating', render: () => <Rating value={4} icon={StarIcon} onChange={() => {}} /> },
  { name: 'Chip', href: '/docs/components/chip', render: () => <Row gap="s-2"><Chip label="React" isSelected onPress={() => {}} /><Chip label="TS" onPress={() => {}} /></Row> },
  { name: 'Badge', href: '/docs/components/badge', render: () => <Badge label="New" bg="primary" /> },
  { name: 'Avatar', href: '/docs/components/avatar', render: () => <Avatar initials="VJ" status="online" /> },
  { name: 'IconBox', href: '/docs/components/icon-box', render: () => <IconBox icon={CheckIcon} /> },
  { name: 'Card', href: '/docs/components/card', render: () => <Card bg="surface" p="s-3" rounded="r-3"><Text variant="bodyMedium">Card content</Text></Card> },
  { name: 'Alert', href: '/docs/components/alert', render: () => <Alert variant="success" message="Changes saved." /> },
  { name: 'Banner', href: '/docs/components/banner', render: () => <Banner variant="info" message="Update available." /> },
  { name: 'Toast', href: '/docs/components/toast', render: () => <Alert variant="success" message="Saved successfully!" /> },
  { name: 'Tooltip', href: '/docs/components/tooltip', render: () => <Tooltip label="Tooltip"><Button variant="outline" label="Hover" onPress={() => {}} /></Tooltip> },
  { name: 'ProgressBar', href: '/docs/components/progress-bar', render: () => <ProgressBar value={0.6} /> },
  { name: 'Spinner', href: '/docs/components/spinner', render: () => <Spinner /> },
  { name: 'Skeleton', href: '/docs/components/skeleton', render: () => <Skeleton w="80%" h={16} /> },
  { name: 'TabBar', href: '/docs/components/tab-bar', render: () => <TabBar tabs={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="a" onChange={() => {}} /> },
  { name: 'Breadcrumb', href: '/docs/components/breadcrumb', render: () => <Breadcrumb items={[{ label: 'Home', onPress: () => {} }, { label: 'Page' }]} /> },
  { name: 'Pagination', href: '/docs/components/pagination', render: () => <Pagination page={2} pageCount={5} onChange={() => {}} /> },
  { name: 'Accordion', href: '/docs/components/accordion', render: () => <Accordion.Root openValues={['a']} onChange={() => {}}><Accordion.Item value="a" title="Section"><Text variant="bodySmall">Content</Text></Accordion.Item></Accordion.Root> },
];

export default function ShowcasePage(): ReactNode {
  return (
    <Layout title="Showcase" description="Live preview of every Vajra UI component, at a glance.">
      <main className={styles.main}>
        <div className="container">
          <Heading as="h1" className={styles.title}>
            Component Showcase
          </Heading>
          <p className={styles.subtitle}>
            Every component, rendered live. Click any card for its full docs, props and playground.
          </p>

          <div className={styles.grid}>
            {items.map(item => (
              <ShowcaseCard key={item.name} name={item.name} href={item.href}>
                {item.render()}
              </ShowcaseCard>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
