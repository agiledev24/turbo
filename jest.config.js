// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<path_to_your_test_tsconfig>/tsconfig.json'
    }
  },
  // other configurations...
};
