import { BASE_URL } from "../api";

describe("BASE_URL", () => {
  it("does not point at the live production IP during tests", () => {
    // jest.env.ts sets a localhost default before this module is imported. If a
    // future change drops that setup, tests could silently point at the public
    // API, so this guards against that regression.
    expect(BASE_URL).not.toContain("91.98.197.3");
  });

  it("uses the Jest EXPO_PUBLIC_API_BASE_URL default", () => {
    expect(BASE_URL).toBe("http://localhost/api");
  });
});
