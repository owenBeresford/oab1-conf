// I'm using a separate thing for HTML, as a post step, rather than linting source
import globals from "globals";

// basic rules
import pluginJs from "@eslint/js";
// ... 
import tseslint from "typescript-eslint";
// normal for me
import jsdoc from 'eslint-plugin-jsdoc';
// Use relevant items from:
// eslint-plugin-jsx-a11y, eslint-plugin-vuejs-accessibility, eslint-plugin-react-native-a11y, eslint-plugin-styled-components-a11y 

export default [
  { languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: [ "dist", "node_modules", "src/tests/" ] },
  {      
    settings: {
    jsdoc: {
      mode: "typescript",
    },
        },
    plugins: { jsdoc },
        "rules": { 
// IMPORTANT:
        "complexity": ["error", 10],    
// just jsdoc
    "jsdoc/check-tag-names": 1,
    "jsdoc/require-jsdoc": 1,
    "jsdoc/newline-after-description": 0,
    "jsdoc/require-description": 1,
    "jsdoc/require-param": 1,
    "jsdoc/require-param-description": 0,
    "jsdoc/require-param-name": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/require-returns": 1,
    "jsdoc/require-returns-description": 0,
    "jsdoc/require-yields": 1
                }
  }
];

