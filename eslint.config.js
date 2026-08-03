"use strict";

const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["node_modules/**", "database/**", "public/*.min.js", "public/audiosynth.js"],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      "no-console": "off",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-throw-literal": "error",
    },
  },
  {
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        $: "readonly",
        Peer: "readonly",
        playLocal: "readonly",
        drumLocal: "readonly",
        Synth: "readonly",
        play: "readonly",
        peers: "writable",
        addUser: "readonly",
        exitHandler: "readonly",
        simKey: "readonly",
        switchInstrument: "readonly",
        pitchy: "readonly",
        openInstrument: "readonly",
        createRoom: "readonly",
        joinRoom: "readonly",
        getCsrfToken: "readonly",
      },
    },
  },
];
