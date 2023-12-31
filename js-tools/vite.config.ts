import { defineConfig } from 'vite';
import path from 'path'; 
import { getGlobals } from 'common-es';
const { __dirname, __filename } = getGlobals(import.meta.url);
import ts from 'vite-plugin-ts';
import vue from '@vitejs/plugin-vue';

let mode='development';
if(process.env && process.env.NODE_ENV) {
	mode=process.env.NODE_ENV;
}
let ofn="";
if(mode==="development") {
	ofn="shopping-test";
} else {
	ofn="shopping";
}


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [ts(), vue() ],
	root: 'XXXXX',
	server: {
      hmr: false
	},
	build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "XXXXXX",
      fileName: (format) => `${ofn}.${format}.js`,
    },
    rollupOptions: {
      external: [ ], 
      output: { 
        globals: {
       },
      },
    },
  },

});

// vim: syn=javascript nospell
