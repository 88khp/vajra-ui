/**
 * Tailwind configuration for the results dashboard (scripts/dashboard-template.html).
 *
 * Separate from ../tailwind.config.js, which is the NativeWind implementation's config.
 * generate-report.js compiles this once per report and inlines the CSS, so every
 * dashboard stays a single file that opens offline.
 */
module.exports = {
  content: [require('path').join(__dirname, 'dashboard-template.html')],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
