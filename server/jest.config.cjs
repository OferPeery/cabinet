module.exports = {
  testMatch: ["**/tests/test.js"],
  setupFiles: ["./jest.env-setup.js"],
  setupFilesAfterEnv: ["./jest.mock-setup.js"],
};
