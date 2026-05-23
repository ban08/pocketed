import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cleanCategoryName,
  createCategory,
  getCategories,
  mergeCategoryNames,
  withDefaultCategories,
} from "../categoryService";

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
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
  it("keeps stored categories and adds defaults", () => {
    const categories = withDefaultCategories([{ id: "rent", name: "Rent" }]);
    expect(categories.map((category) => category.name)).toContain("Rent");
    expect(categories.map((category) => category.name)).toContain("Food");
  });
});

describe("getCategories", () => {
  it("returns an empty list when nothing is stored", async () => {
    await expect(getCategories("u1")).resolves.toEqual([]);
  });

  it("returns previously stored categories", async () => {
    await AsyncStorage.setItem(
      "categories:u1",
      JSON.stringify([{ id: "c1", name: "Food" }])
    );

    await expect(getCategories("u1")).resolves.toEqual([{ id: "c1", name: "Food" }]);
  });
});

describe("createCategory", () => {
  it("stores a new cleaned category", async () => {
    const created = await createCategory("u1", " Groceries ");

    expect(created.name).toBe("Groceries");
    const stored = JSON.parse((await AsyncStorage.getItem("categories:u1")) ?? "[]");
    expect(stored).toEqual([{ id: created.id, name: "Groceries" }]);
  });

  it("returns the existing category when name already exists", async () => {
    const first = await createCategory("u1", "Food");
    const second = await createCategory("u1", " food ");

    expect(second).toEqual(first);
    const stored = JSON.parse((await AsyncStorage.getItem("categories:u1")) ?? "[]");
    expect(stored).toHaveLength(1);
  });

  it("throws for blank input before writing", async () => {
    await expect(createCategory("u1", "   ")).rejects.toThrow(
      "Category name is required"
    );

    expect(await AsyncStorage.getItem("categories:u1")).toBeNull();
  });
});
