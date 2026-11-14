module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.ts$": "ts-jest",
        "^.+\\.js$": "<rootDir>/jest.esm-transformer.js"
    },
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