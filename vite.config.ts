import { defineConfig } from 'vite';
import { terser } from 'rollup-plugin-terser';
import obfuscator from 'rollup-plugin-javascript-obfuscator';

const jsObfuscatorOptions = {
  // HIGH-LEVEL HARDENING
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false, // set true if you need anti-devtools behavior (can be aggressive)
  debugProtectionInterval: false,

  // IDENTIFIERS & PROPERTIES
  identifierNamesGenerator: 'hexadecimal', // short, unreadable names
  renameGlobals: false, // set to true only if you understand global renaming risks
  reservedNames: [],

  // STRING OBFUSCATION (hides most readable texts)
  stringArray: true,
  stringArrayEncoding: ['rc4'], // 'rc4' gives better obfuscation; increases bundle slightly
  stringArrayThreshold: 1.0, // 0..1 - 1.0 tries to move most strings to the array
  rotateStringArray: true,
  stringArrayIndexesType: ['hexadecimal-number'],
  stringArrayWrappersCount: 3,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersType: 'function', // or 'eval' (eval is riskier)
  stringArrayIndexShift: true,

  // MISC
  transformObjectKeys: true,
  unicodeEscapeSequence: false, // true will escape characters to \uXXXX (increases size)

  // PERFORMANCE-TUNING (tweak for your app)
  disableConsoleOutput: true,
  domainLock: [], // restrict code to run only on certain domains (optional, fragile)
  selfDefending: true,
};

export default defineConfig({
  build: {
    sourcemap: false, // don't produce sourcemaps for prod
    minify: 'terser', // use terser for more aggressive mangling
    terserOptions: {
      compress: {
        // remove console.* and debugger statements
        drop_console: true,
        drop_debugger: true,
        passes: 3,
      },
      mangle: {
        // mangle properties can be dangerous; enable only if your app is safe
        // properties: { regex: /^_/ }, // example: mangle properties starting with _
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      // Apply obfuscation and (extra) terser plugin in the Rollup plugin pipeline.
      plugins: [
        // First: obfuscate JS bundles
        obfuscator(jsObfuscatorOptions),

        // Then: run terser again at Rollup stage to minify the obfuscated output.
        // We use rollup-plugin-terser's terser imported above.
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          mangle: true,
          format: {
            comments: false,
          },
        }),
      ]
    },
    // target can be adjusted to modern engines to reduce bundle size
    target: 'es2019',
    // chunk size warnings? raise for obfuscation tests
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 5180,
    host: true
  }
})