import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ["dist/**", "node_modules/**"], // Exclude dist and node_modules from linting
  },
  {
    files: ["webpack.config.js"],
    languageOptions: {
      globals: globals.node, // Enable Node.js globals for webpack.config.js
      sourceType: "script",
    },
  },
  {
    files: ["src/**/*.{js,mjs,cjs,jsx}"], // Ensure the src folder is being linted
    languageOptions: { sourceType: "module" }, // Enable module source type for the src folder
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
];
