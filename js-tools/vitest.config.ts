/// <reference types="vitest" />
//  // / <reference types="vite/client" />

import { configDefaults, defineConfig, UserConfig } from "vitest/config";
// if a project with Vue
import vue from '@vitejs/plugin-vue';

export default defineConfig({
// if a project with Vue, should be be practical for React
  plugins: [ vue() ],
  test: {
    globals: true,
    include: [
      "src/test/*.vitest.ts",
		// possibly add other filre suffixes
   ],
    environment: "jsdom",
    bail: 0,
    watch: false,
  },
  css:true,
  browser: { enabled: true, name: "/snap/bin/chromium" },
});

// vim: syn=typescript nospell

