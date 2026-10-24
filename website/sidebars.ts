import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'installation',
    'theming',
    'custom-theme',
    'text-italic-fonts',
    {
      type: 'category',
      label: 'Layout',
      link: {type: 'generated-index', title: 'Layout', description: 'Primitives for arranging and spacing content.'},
      items: [
        'components/box',
        'components/row',
        'components/col',
        'components/grid',
        'components/center',
        'components/absolute-center',
        'components/absolute-view',
        'components/separator',
        'components/divider',
        'components/spacer',
        'components/pressable',
      ],
    },
    {
      type: 'category',
      label: 'Typography',
      link: {type: 'generated-index', title: 'Typography', description: 'Text rendering primitives.'},
      items: ['components/text'],
    },
    {
      type: 'category',
      label: 'Forms & Inputs',
      link: {type: 'generated-index', title: 'Forms & Inputs', description: 'Collecting and editing user input.'},
      items: [
        'components/button',
        'components/icon-button',
        'components/fab',
        'components/text-input',
        'components/input',
        'components/searchbar',
        'components/checkbox',
        'components/radio',
        'components/switch',
        'components/icon-switch',
        'components/select',
        'components/slider',
        'components/stepper',
        'components/rating',
        'components/date-picker',
        'components/time-picker',
      ],
    },
    {
      type: 'category',
      label: 'Navigation',
      link: {type: 'generated-index', title: 'Navigation', description: 'Moving between screens and sections.'},
      items: [
        'components/tabs',
        'components/tab-bar',
        'components/app-bar',
        'components/breadcrumb',
        'components/pagination',
      ],
    },
    {
      type: 'category',
      label: 'Overlays',
      link: {type: 'generated-index', title: 'Overlays', description: 'Content layered above the screen.'},
      items: [
        'components/modal',
        'components/sheet',
        'components/drawer',
        'components/menu',
        'components/popover',
        'components/tooltip',
      ],
    },
    {
      type: 'category',
      label: 'Feedback',
      link: {type: 'generated-index', title: 'Feedback', description: 'Communicating status and progress.'},
      items: [
        'components/toast',
        'components/alert',
        'components/banner',
        'components/progress-bar',
        'components/spinner',
        'components/skeleton',
      ],
    },
    {
      type: 'category',
      label: 'Data Display',
      link: {type: 'generated-index', title: 'Data Display', description: 'Presenting content and collections.'},
      items: [
        'components/list',
        'components/card',
        'components/carousel',
        'components/avatar',
        'components/badge',
        'components/chip',
        'components/icon-box',
        'components/accordion',
      ],
    },
    'performance',
    'contributing',
    'changelog',
  ],
};

export default sidebars;
