export default {
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    testMatch: ["**/tests/**/*.test.(js|ts)"],
    testPathIgnorePatterns: ["/node_modules/"],
};
