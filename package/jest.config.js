const { createJsWithTsPreset } = require("ts-jest")

module.exports = {
    ...createJsWithTsPreset({ tsconfig: { allowJs: true } }),
    testEnvironment: "jsdom",
    transformIgnorePatterns: [
        "/node_modules/(?!@rdfjs/)"
    ],
    verbose: true,
    testRegex: "/test/.*\\.test\\.ts$",
    coverageDirectory: "./coverage/",
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts"
    ]
};