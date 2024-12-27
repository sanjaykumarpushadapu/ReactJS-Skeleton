import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks'; // For React Hooks rules
import pluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'], // Exclude dist and node_modules from linting
  },
  {
    files: ['webpack.config.js'],
    languageOptions: {
      globals: globals.node, // Enable Node.js globals for webpack.config.js
      sourceType: 'script',
    },
  },
  {
    files: ['src/**/*.{js,mjs,cjs,jsx}'], // Ensure the src folder is being linted
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended, // JavaScript recommended rules
  pluginReact.configs.flat.recommended, // React recommended rules
  {
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks, // Add React Hooks plugin
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      // Prettier rules
      'prettier/prettier': 'error', // Flag Prettier formatting issues as errors

      // React-specific rules
      'react/prop-types': 'warn', // Disable prop-types if you're using TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/jsx-uses-react': 'off', // Not needed with React 17+
      'react/jsx-uses-vars': 'error', // Prevent unused variables in JSX
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }], // Ignore React in unused vars
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error', // Enforce rules of hooks
      'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies in useEffect
    },
  },
  prettierConfig, // Add Prettier configuration to ESLint
];
