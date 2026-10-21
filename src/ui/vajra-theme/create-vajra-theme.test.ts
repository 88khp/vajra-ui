import { createVajraTheme } from './create-vajra-theme';
import { defaultVajraTheme } from './vajra-theme';

const fonts = { inter: { '400': 'Inter-Regular', '700': 'Inter-Bold' } };

describe('createVajraTheme', () => {
  it('defaults to the light theme base when colorScheme is omitted', () => {
    const theme = createVajraTheme({ fonts });

    expect(theme.colors.primary).toBe(defaultVajraTheme.light.colors.primary);
    expect(theme.spacing).toEqual(defaultVajraTheme.light.spacing);
    expect(theme.rounded).toEqual(defaultVajraTheme.light.rounded);
  });

  it('uses the dark theme base when colorScheme is "dark"', () => {
    const theme = createVajraTheme({ colorScheme: 'dark', fonts });

    expect(theme.colors.primary).toBe(defaultVajraTheme.dark.colors.primary);
    expect(theme.colors.primary).not.toBe(defaultVajraTheme.light.colors.primary);
  });

  it('merges partial color overrides on top of the base defaults, leaving the rest intact', () => {
    const theme = createVajraTheme({ fonts, colors: { primary: '#0055ff' } });

    expect(theme.colors.primary).toBe('#0055ff');
    // Untouched tokens fall through from the base theme.
    expect(theme.colors.error).toBe(defaultVajraTheme.light.colors.error);
    expect(theme.colors.surface).toBe(defaultVajraTheme.light.colors.surface);
  });

  it('merges partial spacing overrides, leaving other spacing tokens intact', () => {
    const theme = createVajraTheme({ fonts, spacing: { 's-4': 18 } });

    expect(theme.spacing['s-4']).toBe(18);
    expect(theme.spacing['s-2']).toBe(defaultVajraTheme.light.spacing['s-2']);
  });

  it('merges partial rounded overrides, leaving other rounded tokens intact', () => {
    const theme = createVajraTheme({ fonts, rounded: { 'r-2': 10 } });

    expect(theme.rounded['r-2']).toBe(10);
    expect(theme.rounded['r-4']).toBe(defaultVajraTheme.light.rounded['r-4']);
  });

  it('merges partial typography overrides, leaving other variants intact', () => {
    const customH1 = { fontSize: 40, lineHeight: 48, fontWeight: '700' as const };
    const theme = createVajraTheme({ fonts, typography: { h1: customH1 } });

    expect(theme.typography.h1).toEqual(customH1);
    expect(theme.typography.body).toEqual(defaultVajraTheme.light.typography.body);
  });

  it('merges partial fontSizes and lineHeights overrides', () => {
    const theme = createVajraTheme({
      fonts,
      fontSizes: { 'f-2': 17 },
      lineHeights: { 'f-2': 24 },
    });

    expect(theme.fontSizes['f-2']).toBe(17);
    expect(theme.lineHeights['f-2']).toBe(24);
    expect(theme.fontSizes['f-1']).toBe(defaultVajraTheme.light.fontSizes['f-1']);
  });

  it('assigns the given fonts map as-is', () => {
    const theme = createVajraTheme({ fonts });

    expect(theme.fonts).toBe(fonts);
  });

  it('defaults toast and alert maxVisible to the base theme values when omitted', () => {
    const theme = createVajraTheme({ fonts });

    expect(theme.toast.maxVisible).toBe(defaultVajraTheme.light.toast.maxVisible);
    expect(theme.alert.maxVisible).toBe(defaultVajraTheme.light.alert.maxVisible);
  });

  it('merges partial toast and alert overrides, leaving the other intact', () => {
    const theme = createVajraTheme({ fonts, toast: { maxVisible: 5 } });

    expect(theme.toast.maxVisible).toBe(5);
    expect(theme.alert.maxVisible).toBe(defaultVajraTheme.light.alert.maxVisible);
  });
});

describe('createVajraTheme font and app bar options', () => {
  it('stores the defaultFont key on the theme', () => {
    const theme = createVajraTheme({ fonts, defaultFont: 'inter' });

    expect(theme.defaultFont).toBe('inter');
  });

  it('merges partial appBar overrides, leaving the other intact', () => {
    const theme = createVajraTheme({ fonts, appBar: { bg: 'background' } });

    expect(theme.appBar.bg).toBe('background');
    expect(theme.appBar.tint).toBe(defaultVajraTheme.light.appBar.tint);
  });
});
