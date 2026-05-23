import {
  cleanCategoryName,
  createCategory,
  getCategories,
  mergeCategoryNames,
  withDefaultCategories,
} from "../categoryService";

const mockFetch = (response: { ok: boolean; body?: any }) => {
  const fn = jest.fn().mockResolvedValue({
    ok: response.ok,
    json: async () => response.body ?? {},
  });
  global.fetch = fn as unknown as typeof fetch;
  return fn;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("cleanCategoryName", () => {
  it("trims and collapses whitespace", () => {
    expect(cleanCategoryName("  Health   Care  ")).toBe("Health Care");
  });
});

describe("mergeCategoryNames", () => {
  it("deduplicates names case-insensitively and sorts them", () => {
    expect(mergeCategoryNames(["Food", " transport "], ["food", "Rent"])).toEqual([
      "Food",
      "Rent",
      "transport",
    ]);
  });
});

describe("withDefaultCategories", () => {
  it("keeps API categories and adds defaults", () => {
    const categories = withDefaultCategories([{ id: "rent", name: "Rent" }]);
    expect(categories.map((category) => category.name)).toContain("Rent");
    expect(categories.map((category) => category.name)).toContain("Food");
  });
});

describe("getCategories", () => {
  it("returns normalized categories from the API", async () => {
    mockFetch({
      ok: true,
      body: [
        { id: "c1", name: " Food " },
        { id: "c2", name: "" },
      ],
    });

    await expect(getCategories("u1")).resolves.toEqual([{ id: "c1", name: "Food" }]);
  });

  it("throws when the API responds with an error", async () => {
    mockFetch({ ok: false });
    await expect(getCategories("u1")).rejects.toThrow("Failed to fetch categories");
  });
});

describe("createCategory", () => {
  it("posts a cleaned category name", async () => {
    const fetchMock = mockFetch({ ok: true, body: { id: "c1", name: "Groceries" } });

    await expect(createCategory("u1", " Groceries ")).resolves.toEqual({
      id: "c1",
      name: "Groceries",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/users\/u1\/categories$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ name: "Groceries" });
  });

  it("throws for blank input before calling the API", async () => {
    const fetchMock = mockFetch({ ok: true });

    await expect(createCategory("u1", "   ")).rejects.toThrow(
      "Category name is required"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
