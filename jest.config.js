module.exports = {
  setupFiles: ['jest-localstorage-mock', './src/setupTests.js'],
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'svelte'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
