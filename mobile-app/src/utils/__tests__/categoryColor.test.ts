import {
  categoryTestId,
  getCategoryFallbackColor,
  getCategoryKey,
  normalizeCategoryName,
} from "../categoryColor";

describe("normalizeCategoryName", () => {
  it("trims and collapses category whitespace", () => {
    expect(normalizeCategoryName("  Health   Care  ")).toBe("Health Care");
  });

  it("uses Other for blank names", () => {
    expect(normalizeCategoryName("   ")).toBe("Other");
    expect(normalizeCategoryName()).toBe("Other");
  });
});

describe("getCategoryKey", () => {
  it("uses a stable case-insensitive key", () => {
    expect(getCategoryKey(" Food ")).toBe("food");
  });
});

describe("categoryTestId", () => {
  it("slugifies readable category names", () => {
    expect(categoryTestId("Health Care")).toBe("health-care");
  });

  it("falls back when the slug would be empty", () => {
    expect(categoryTestId("é")).toMatch(/^unknown-/);
  });
});

describe("getCategoryFallbackColor", () => {
  it("returns a deterministic palette color", () => {
    expect(getCategoryFallbackColor("Food")).toBe(getCategoryFallbackColor("Food"));
    expect(getCategoryFallbackColor("Food")).toMatch(/^#[0-9A-F]{6}$/);
  });
});
