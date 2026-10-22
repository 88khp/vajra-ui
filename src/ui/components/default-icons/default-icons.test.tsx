/* eslint-disable @typescript-eslint/no-var-requires -- these tests load modules with require() inside jest.isolateModules to simulate a missing @88khp/vajra-icons */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XIcon,
} from '@88khp/vajra-icons';

import { DEFAULT_ICONS, FALLBACK_ICONS } from './default-icons';

type TDefaultIconsModule = typeof import('./default-icons');

/**
 * Loads modules as if @88khp/vajra-icons were not installed. They share one isolated registry,
 * and the test's own React and React Native, so hooks and context work across them.
 */
const requireWithoutVajraIcons = <T,>(load: () => T): T => {
  let loaded: T | undefined;
  const ReactModule = require('react');
  const ReactNativeModule = require('react-native');

  jest.isolateModules(() => {
    jest.doMock('react', () => ReactModule);
    jest.doMock('react-native', () => ReactNativeModule);
    jest.doMock('@88khp/vajra-icons', () => {
      throw new Error("Cannot find module '@88khp/vajra-icons'");
    });
    loaded = load();
  });

  return loaded as T;
};

describe('DEFAULT_ICONS', () => {
  afterEach(() => {
    jest.dontMock('@88khp/vajra-icons');
    jest.dontMock('react');
    jest.dontMock('react-native');
  });

  it('uses @88khp/vajra-icons when it is installed', () => {
    expect(DEFAULT_ICONS).toEqual({
      dismiss: XIcon,
      error: AlertCircleIcon,
      info: InfoIcon,
      success: CheckCircleIcon,
      warning: AlertTriangleIcon,
    });
  });

  it('falls back to text glyphs when @88khp/vajra-icons is not installed', () => {
    const { DEFAULT_ICONS: icons, FALLBACK_ICONS: fallbacks } = requireWithoutVajraIcons(
      (): TDefaultIconsModule => require('./default-icons'),
    );

    expect(icons).toEqual(fallbacks);
  });

  it('renders each fallback glyph at the requested size and color, hidden from screen readers', () => {
    const glyphs = { dismiss: '✕', error: '!', info: 'i', success: '✓', warning: '⚠︎' };

    for (const [name, glyph] of Object.entries(glyphs)) {
      const Icon = FALLBACK_ICONS[name as keyof typeof glyphs];

      render(<Icon size={20} width={20} height={20} color="#ff0000" />);

      const text = screen.getByText(glyph, { includeHiddenElements: true });

      expect(text.props.style).toEqual(
        expect.objectContaining({ color: '#ff0000', fontSize: 16, lineHeight: 20, width: 20 }),
      );
      expect(text.props.importantForAccessibility).toBe('no');
      expect(text.props.accessibilityElementsHidden).toBe(true);
      screen.unmount();
    }
  });

  it('renders Alert and Toast without @88khp/vajra-icons', () => {
    const { VajraProvider, Alert, ToastItem } = requireWithoutVajraIcons(() => ({
      ...(require('../../vajra-theme') as typeof import('../../vajra-theme')),
      ...(require('../alert') as typeof import('../alert')),
      ...(require('../toast/components/toast-item') as typeof import('../toast/components/toast-item')),
    }));

    render(
      <VajraProvider>
        <Alert message="Saved" variant="success" onDismiss={() => {}} />
        <ToastItem message="Sent" variant="info" dismissible onDismiss={() => {}} />
      </VajraProvider>,
    );

    expect(screen.getByText('✓', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText('i', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getAllByText('✕', { includeHiddenElements: true })).toHaveLength(2);
  });
});
