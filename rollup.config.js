import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import livereload from "rollup-plugin-livereload";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import { terser } from "rollup-plugin-terser";
import rollup_start_dev from "./rollup_start_dev";
import replace from "rollup-plugin-replace";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import alias from "rollup-plugin-alias";
import path from "path";
import typescript from "@wessberg/rollup-plugin-ts";

const svelteOptions = require("./svelte.config")

const production = !process.env.ROLLUP_WATCH;
const dev = !!process.env.ROLLUP_WATCH;

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js"
    // This should omit all warnings but doesn't work?
    // onwarn(warning, warn) {
    //   return;
    // }
  },
  // 👇🏽 Suppress svelte-i18n warnings https://github.com/kaisermann/svelte-i18n/issues/12
  // Tried suppressing "THIS_IS_UNDEFINED" with rollup onwarn but couldn't get it working.
  // Re-exports warning still showing. See link to issue.
  moduleContext: id => {
    const thisAsWindowForModules = [
      "node_modules/intl-messageformat/lib/core.js",
      "node_modules/intl-messageformat/lib/compiler.js",
      "node_modules/intl-messageformat/lib/formatters.js",
      "node_modules/intl-messageformat-parser/lib/normalize.js",
      "node_modules/intl-messageformat-parser/lib/parser.js",
      "node_modules/intl-format-cache/lib/index.js"
    ];

    if (thisAsWindowForModules.some(id_ => id.trimRight().endsWith(id_))) {
      return "window";
    }
  },
  // 👆🏽
  plugins: [
    // Setup an alias for src/ as @app for imports eg. "@app/components/..."
    // instead of relative imports "../../components"
    alias({
      resolve: [".js", ".svelte", ".css"],
      entries: [
        {
          find: "@app",
          replacement: path.resolve(__dirname, "./src")
        }
      ]
    }),
    svelte({
      // Typescript
      ...svelteOptions,
      // Necessary for tailwind @apply in svelte <style>
      emitCss: true,
      // enable run-time checks when not in production
      dev: !production
    }),

    postcss({
      extract: "public/bundle.css",
      sourceMap: !production,
      minimize: production
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee =>
        importee === "svelte" || importee.startsWith("svelte/")
    }),
    commonjs(),
    typescript(),
    replace({
      "process.env.NODE_ENV": dev
        ? JSON.stringify("development")
        : JSON.stringify("production")
    }),

    // Required for bitcoin nodejs shims.
    globals({ global: true }),
    builtins(),
    json(),

    // In dev mode, call `npm run start:dev` once
    // the bundle has been generated
    !production && rollup_start_dev,

    // Watch the `build` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
