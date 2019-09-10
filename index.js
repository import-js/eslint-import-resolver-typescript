'use strict';

const path = require('path');
const resolve = require('resolve');
const tsconfigPaths = require('tsconfig-paths');
const debug = require('debug');
const globSync = require('glob').sync;
const isGlob = require('is-glob');

const log = debug('eslint-import-resolver-typescript');

const extensions = ['.ts', '.tsx', '.d.ts'].concat(
  Object.keys(require.extensions),
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

  // naive attempt at @types/* resolution,
  // if path is neither absolute nor relative
  if (
    (/\.jsx?$/.test(foundNodePath) ||
      (options.alwaysTryTypes && !foundNodePath)) &&
    !/^@types[/\\]/.test(source) &&
    !path.isAbsolute(source) &&
    source[0] !== '.'
  ) {
    const definitelyTyped = resolveFile(
      '@types' + path.sep + mangleScopedPackage(source),
      file,
      options,
    );
    if (definitelyTyped.found) {
      return definitelyTyped;
    }
  }

  if (foundNodePath) {
    log('matched node path:', foundNodePath);

    return {
      found: true,
      path: foundNodePath,
    };
  }

  log("didn't find", source);

  return {
    found: false,
  };
}

function packageFilter(pkg) {
  pkg.main =
    pkg.types || pkg.typings || pkg.module || pkg['jsnext:main'] || pkg.main;
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

/*
 * For a scoped package, we must look in `@types/foo__bar` instead of `@types/@foo/bar`.
 *
 * @param {string} moduleName
 * @returns {string}
 */
function mangleScopedPackage(moduleName) {
  if (moduleName[0] === '@') {
    const replaceSlash = moduleName.replace(path.sep, '__');
    if (replaceSlash !== moduleName) {
      return replaceSlash.slice(1); // Take off the "@"
    }
  }
  return moduleName;
}

module.exports = {
  interfaceVersion: 2,
  resolve: resolveFile,
};
