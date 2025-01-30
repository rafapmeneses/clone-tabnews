import globals from "globals";

export default [
  { languageOptions: { globals: globals.browser } },
  {
    files: ["*.js"],
    rules: {
      "prefer-const": "warn",
      "no-duplicate-imports": "warn",
      "no-import-assign": "warn",
      "no-unused-vars": "warn",
    },
  },
];
