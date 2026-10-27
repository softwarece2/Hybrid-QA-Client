// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageReporters: ["html", "text"],
  coverageDirectory: "coverage", // default
  collectCoverageFrom: ["src/App.test.js"], // or .ts, .tsx, etc.
};
