"use strict";

module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "script",
  },
  env: {
    es2021: true,
    node: true,
  },
  plugins: ["node"],
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:node/recommended",
    "plugin:react/recommended",
  ],
  rules: {
    strict: "error",
    "node/no-unpublished-require": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
