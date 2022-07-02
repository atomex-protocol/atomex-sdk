/* eslint-disable no-await-in-loop */
/* eslint-env node */
const startTime = process.hrtime.bigint();
import { spawnSync } from 'child_process';
import path from 'node:path';

import { build } from 'esbuild';

let lastTime = startTime;
/**
 * @type {import('esbuild').Plugin}
 */
const makeAllPackagesExternalPlugin = {
  name: 'make-all-packages-external',
  setup: build => build.onResolve(
    { filter: /^[^./]|^\.[^./]|^\.\.[^/]/ },
    args => ({ external: true, path: args.path })
  )
};

/**
 * @type {import('esbuild').Plugin}
 */
const applyPlatformModulesPlugin = {
  name: 'apply-platform-modules-plugin',
  setup: build => build.onResolve(
    { filter: /index.abstract/ },
    args => {
      let updatedPath = args.path.match(/.(js|ts,mjs,mts)/) ? args.path : args.path + '.ts';
      updatedPath = updatedPath.replace('abstract', build.initialOptions.platform === 'browser' ? 'browser' : 'node');

      return { path: path.join(args.resolveDir, updatedPath) };
    }
  )
};

/**
 * @type {import('esbuild').BuildOptions}
 */
const baseOptions = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  treeShaking: true,
  sourcemap: true,
  plugins: [
    makeAllPackagesExternalPlugin,
    applyPlatformModulesPlugin
  ]
};

/**
 * @param {boolean} isProduction 
 * @returns {import('esbuild').BuildOptions}
 */
const getNodeJsOptions = isProduction => ({
  ...baseOptions,
  outdir: isProduction ? './dist/node' : './dist/node/development',
  target: 'node16',
  platform: 'node',
  minify: false
});

/**
 * @param {boolean} isProduction 
 * @returns {import('esbuild').BuildOptions}
 */
const getBrowserJsOptions = isProduction => ({
  ...baseOptions,
  outdir: isProduction ? './dist/browser' : './dist/browser/development',
  target: 'es2017',
  platform: 'browser',
  minify: isProduction
});

const getElapsedTimeMs = (useLastTime = true) => {
  const newLastTime = process.hrtime.bigint();
  const result = (newLastTime - (useLastTime ? lastTime : startTime)) / 1000000n;

  lastTime = newLastTime;
  return result;
};

const fail = error => {
  console.error('\x1b[31mFailed!\x1b[0m Reason:', error);
  process.exit(1);
};

try {
  console.info('Type checking...');
  const typeCheckingResult = spawnSync('npm', ['run', 'check-types'], { shell: true, stdio: 'inherit' });
  if (typeCheckingResult.status > 0)
    fail('Type checking failed');

  console.info(`Type checking is completed (${getElapsedTimeMs()}ms)`);
  console.info('Building...');

  for (const isProduction of [true, false]) {
    for (const [format, outExtension] of [['cjs', '.cjs'], ['cjs', '.js'], ['esm', '.mjs']]) {
      await build({
        ...getNodeJsOptions(isProduction),
        format,
        outExtension: { '.js': outExtension }
      });
    }

    await build({
      ...getBrowserJsOptions(isProduction),
      format: 'cjs'
    });
  }

  console.info(`Building is completed (${getElapsedTimeMs()}ms)`);
  console.info(`\n\x1b[32mDone in ${getElapsedTimeMs(false)}ms\x1b[0m`);
} catch (error) {
  fail(error);
}
