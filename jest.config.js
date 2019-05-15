module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/*.{js,jsx}',
    'src/**/*.{js,jsx}',
  ],
  coverageDirectory: 'test-reports/',
  setupFiles: ['./setupJest.js'],
};
