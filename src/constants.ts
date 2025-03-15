export const defaultConditionNames = [
  'types',
  'import',

  // APF: https://angular.io/guide/angular-package-format
  'esm2020',
  'es2020',
  'es2015',

  'require',
  'node',
  'node-addons',
  'browser',
  'default',
]

/**
 * `.mts`, `.cts`, `.d.mts`, `.d.cts`, `.mjs`, `.cjs` are not included because `.cjs` and `.mjs` must be used explicitly
 */
export const defaultExtensions = [
  '.ts',
  '.tsx',
  '.d.ts',
  '.js',
  '.jsx',
  '.json',
  '.node',
]

export const defaultExtensionAlias = {
  '.js': [
    '.ts',
    // `.tsx` can also be compiled as `.js`
    '.tsx',
    '.d.ts',
    '.js',
  ],
  '.jsx': ['.tsx', '.d.ts', '.jsx'],
  '.cjs': ['.cts', '.d.cts', '.cjs'],
  '.mjs': ['.mts', '.d.mts', '.mjs'],
}

export const defaultMainFields = [
  'types',
  'typings',

  // APF: https://angular.io/guide/angular-package-format
  'fesm2020',
  'fesm2015',
  'esm2020',
  'es2020',

  'module',
  'jsnext:main',

  'main',
]

export const JS_EXT_PATTERN = /\.(?:[cm]js|jsx?)$/

export const IMPORT_RESOLVER_NAME = 'eslint-import-resolver-typescript'

export const interfaceVersion = 2

export const DEFAULT_TSCONFIG = 'tsconfig.json'

export const DEFAULT_JSCONFIG = 'jsconfig.json'

export const DEFAULT_CONFIGS = [DEFAULT_TSCONFIG, DEFAULT_JSCONFIG]

export const DEFAULT_TRY_PATHS = ['', ...DEFAULT_CONFIGS]

export const MATCH_ALL = '**'

export const DEFAULT_IGNORE = [MATCH_ALL, 'node_modules', MATCH_ALL].join('/')
