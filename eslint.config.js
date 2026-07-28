const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["node_modules/", "public/*.min.js", "public/audiosynth.js", "database/"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        // Node.js globals for server code
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["public/**/*.js"],
    languageOptions: {
      globals: {
        // Browser globals
        document: "readonly",
        window: "readonly",
        sessionStorage: "readonly",
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
