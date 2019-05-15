module.exports = wallaby => ({
  files: [
    'setupJest.js',
    'config/*.*',
    '__fixtures__/**/*.json',
    'src/**/*.js?(x)',
    '!src/**/*.test.js?(x)',
  ],

  tests: [
    'src/**/*.test.js?(x)',
  ],

  env: {
    type: 'node',
    runner: 'node',
    params: {
      env: 'TZ="America/Sao_Paulo"',
    },
  },

  compilers: {
    '**/*.js?(x)': wallaby.compilers.babel(),
  },

  testFramework: 'jest',

  debug: true,
});
