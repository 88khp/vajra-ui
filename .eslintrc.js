module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-native', 'import', 'simple-import-sort', 'check-file'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    // No default exports — named exports only
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ExportDefaultDeclaration',
        message: 'Default exports are not allowed. Use named exports only.',
      },
    ],

    // No interfaces — use type only
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    // Blank lines between statements for readability
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'any', prev: 'import', next: 'import' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'any', prev: 'export', next: 'export' },
      { blankLine: 'always', prev: 'const', next: 'expression' },
      { blankLine: 'always', prev: 'expression', next: 'const' },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],

    // Every file must end with a newline
    'eol-last': ['error', 'always'],

    // No function keyword — use arrow functions only
    'prefer-arrow-callback': 'error',
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],

    // Type names must start with T
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: { regex: '^T[A-Z]', match: true },
      },
    ],

    // Import/export order — alphabetical
    'import/namespace': 'off',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': 'off',
    'simple-import-sort/exports': 'error',

    // Enforce kebab-case filenames
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{ts,tsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true },
    ],

  },

  overrides: [
    {
      // Layer boundary: components must go through core, never straight to vajra-ui-core
      files: ['src/ui/components/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@88khp/vajra-ui-core',
                message: 'components/* must not import @88khp/vajra-ui-core directly — go through src/ui/core instead.',
              },
            ],
          },
        ],
      },
    },
    {
      // Layer boundary: core must not import from the opinionated components layer above it,
      // and (like every other layer besides vajra-theme itself) must not reach into src/theme directly.
      files: ['src/ui/core/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**components**'],
                message: 'src/ui/core must not import from src/ui/components — core sits below components in the layer stack.',
              },
              {
                group: ['**/theme', '**/theme/**', '!**/vajra-theme/**'],
                message: 'src/theme is internal to src/ui/vajra-theme — use useVajraTheme/VajraProvider instead of importing src/theme directly.',
              },
            ],
          },
        ],
      },
    },
    {
      // Layer boundary: the generic theme engine is internal plumbing for vajra-theme only
      files: ['src/**/*.{ts,tsx}'],
      excludedFiles: ['src/theme/**', 'src/ui/vajra-theme/**', 'src/ui/core/**', 'src/index.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/theme', '**/theme/**', '!**/vajra-theme/**'],
                message: 'src/theme is internal to src/ui/vajra-theme — use useVajraTheme/VajraProvider instead of importing src/theme directly.',
              },
            ],
          },
        ],
      },
    },
  ],
  env: {
    node: true,
  },

  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
};
