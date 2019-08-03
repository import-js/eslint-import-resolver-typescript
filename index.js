'use strict';

const path = require('path');
const resolve = require('resolve');
const tsconfigPaths = require('tsconfig-paths');
const debug = require('debug');
const globSync = require('glob').sync;
const isGlob = require('is-glob');

const log = debug('eslint-import-resolver-typescript');

const extensions = Object.keys(require.extensions).concat(
  '.ts',
  '.tsx',
  '.d.ts',
);

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 */
function resolveFile(source, file, options = {}) {
  log('looking for:', source);

  // don't worry about core node modules
  if (resolve.isCore(source)) {
    log('matched core:', source);

    return {
      found: true,
      path: null,
    };
  }

  initMappers(options);
  const mappedPath = getMappedPath(source, file);
  if (mappedPath) {
    log('matched ts path:', mappedPath);
  }

  // note that even if we map the path, we still need to do a final resolve
  let foundNodePath;
  try {
    foundNodePath = resolve.sync(mappedPath || source, {
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

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @returns The mapped path of the module or undefined
 */
function getMappedPath(source, file) {
  const paths = mappers
    .map(mapper => mapper(source, file))
    .filter(path => !!path);

  if (paths.length > 1) {
    log('found multiple matching ts paths:', paths);
  }

  return paths[0];
}

let mappers;
function initMappers(options) {
  if (mappers) {
    return;
  }

  const isArrayOfStrings = array =>
    Array.isArray(array) && array.every(o => typeof o === 'string');

  const configPaths =
    typeof options.directory === 'string'
      ? [options.directory]
      : isArrayOfStrings(options.directory)
      ? options.directory
      : [process.cwd()];

  mappers = configPaths
    // turn glob patterns into paths
    .reduce(
      (paths, path) => paths.concat(isGlob(path) ? globSync(path) : path),
      [],
    )

    .map(path => tsconfigPaths.loadConfig(path))
    .filter(configLoaderResult => {
      const success = configLoaderResult.resultType === 'success';
      if (!success) {
        // this can happen if the user has problems with their tsconfig
        // or if it's valid, but they don't have baseUrl set
        log('failed to init tsconfig-paths:', configLoaderResult.message);
      }
      return success;
    })
    .map(configLoaderResult => {
      const matchPath = tsconfigPaths.createMatchPath(
        configLoaderResult.absoluteBaseUrl,
        configLoaderResult.paths,
      );

      return (source, file) => {
        // exclude files that are not part of the config base url
        if (!file.includes(configLoaderResult.absoluteBaseUrl)) {
          return undefined;
        }

        // look for files based on setup tsconfig "paths"
        return matchPath(source, undefined, undefined, extensions);
      };
    });
}

module.exports = {
  interfaceVersion: 2,
  resolve: resolveFile,
};
