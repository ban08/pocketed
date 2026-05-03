module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>/src", "<rootDir>/app"],
  setupFiles: ["<rootDir>/jest.env.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.expo/", "/android/", "/ios/"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-clone-referenced-element|@react-native-community|@testing-library)"
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.style.ts",
    "!src/models/**",
    "!src/theme/**",
    "!src/resources/**",
    "!src/**/*.d.ts"
  ],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
      functions: 85,
      branches: 70
    }
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"]
};
