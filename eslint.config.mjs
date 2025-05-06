import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": "warn",
      "semi": "warn",
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-undef-init": "warn",
      "no-unused-imports": "warn",
      "no-unused-vars": "warn",
      "no-unused-vars": "warn",
    },
  },
];
