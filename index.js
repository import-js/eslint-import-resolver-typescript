'use strict';

const path = require('path');
const resolve = require('resolve');
const tsconfigPaths = require('tsconfig-paths');
const debug = require('debug');

const log = debug('eslint-import-resolver-typescript');

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 */
function resolveFile(source, file, config) {
  log('looking for:', source);

  // don't worry about core node modules
  if (resolve.isCore(source)) {
    log('matched core:', source);

    return {
      found: true,
      path: null,
    };
  }

  let foundTsPath = null;
  const extensions = Object.keys(require.extensions).concat(
    '.ts',
    '.tsx',
    '.d.ts',
  );

  // setup tsconfig-paths
  const searchStart = config.directory || process.cwd();
  const configLoaderResult = tsconfigPaths.loadConfig(searchStart);
  if (configLoaderResult.resultType === 'success') {
    const matchPath = tsconfigPaths.createMatchPath(
      configLoaderResult.absoluteBaseUrl,
      configLoaderResult.paths,
    );

    // look for files based on setup tsconfig "paths"
    foundTsPath = matchPath(source, undefined, undefined, extensions);

    if (foundTsPath) {
      log('matched ts path:', foundTsPath);
    }
  } else {
    log('failed to init tsconfig-paths:', configLoaderResult.message);
    // this can happen if the user has problems with their tsconfig
    // or if it's valid, but they don't have baseUrl set
  }

  // note that even if we match via tsconfig-paths, we still need to do a final resolve
  let foundNodePath;
  try {
    foundNodePath = resolve.sync(foundTsPath || source, {
      extensions,
      basedir: path.dirname(path.resolve(file)),
      packageFilter,
    });
  } catch (err) {
    foundNodePath = null;
  }

  if (foundNodePath) {
    log('matched node path:', foundNodePath);

    return {
      found: true,
      path: foundNodePath,
    };
  }

  log('didnt find', source);

  return {
    found: false,
  };
}
function packageFilter(pkg) {
  if (pkg['jsnext:main']) {
    pkg['main'] = pkg['jsnext:main'];
  }
  return pkg;
}

module.exports = {
  interfaceVersion: 2,
  resolve: resolveFile,
};
