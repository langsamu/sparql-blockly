module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    verbose: true,
    testRegex: "/test/.*\\.test\\.ts$",
    coverageDirectory: "./coverage/",
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts"
    ]
};