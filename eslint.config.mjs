import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
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
    languageOptions: { sourceType: 'module' }, // Enable module source type for the src folder
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended, // JavaScript recommended rules
  pluginReact.configs.flat.recommended, // React recommended rules
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error', // Flag Prettier formatting issues as errors
    },
  },
  prettierConfig, // Add Prettier configuration to ESLint
];
