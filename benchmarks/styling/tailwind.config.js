/**
 * Tailwind configuration for the NativeWind implementation.
 *
 * Colors are CSS variables. NativeWind's vars() sets them on the provider root, so
 * switching theme is a single style change at the root. Typography and spacing use
 * the same values as shared/spec.ts. The parity test asserts this, so any drift fails.
 */
module.exports = {
  content: ['./implementations/nativewind/**/*.tsx'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        surfaceRaised: 'var(--color-surfaceRaised)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        textSubtle: 'var(--color-textSubtle)',
        textInverse: 'var(--color-textInverse)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
      },
      // NativeWind's default rem is 14px, which would shift every spacing and radius value.
      // These are the spec's pixel values, pinned explicitly.
      spacing: {
        2: '8px',
        3: '12px',
        4: '16px',
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
      fontSize: {
        'bench-title': ['20px', { lineHeight: '24px', fontWeight: '600' }],
        'bench-body': ['16px', { lineHeight: '20px', fontWeight: '400' }],
        'bench-button': ['16px', { lineHeight: '20px', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
