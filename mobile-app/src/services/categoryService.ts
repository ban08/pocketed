import { BASE_URL } from "./api";
import { Category, DEFAULT_EXPENSE_CATEGORIES } from "../models/Category";

export function cleanCategoryName(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).join(" ");
}

export function mergeCategoryNames(...groups: (string | undefined)[][]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];

  groups.flat().forEach((name) => {
    const cleanName = cleanCategoryName(name ?? "");
    const key = cleanName.toLocaleLowerCase();
    if (!cleanName || seen.has(key)) return;

    seen.add(key);
    names.push(cleanName);
  });

  return names.sort((a, b) => a.localeCompare(b));
}

export function withDefaultCategories(categories: Category[]): Category[] {
  const apiNames = categories.map((category) => category.name);
  const mergedNames = mergeCategoryNames(apiNames, DEFAULT_EXPENSE_CATEGORIES);

  return mergedNames.map((name) => {
    const existing = categories.find(
      (category) => category.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );

    return existing ?? { id: name, name };
  });
}

export async function getCategories(userId: string): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();
  const categories = Array.isArray(data) ? data : [];

  return categories
    .filter((category) => category && typeof category.name === "string")
    .map((category) => ({
      id: typeof category.id === "string" ? category.id : category.name,
      name: cleanCategoryName(category.name),
    }))
    .filter((category) => category.name.length > 0);
}

export async function createCategory(userId: string, name: string): Promise<Category> {
  const cleanName = cleanCategoryName(name);
  if (!cleanName) throw new Error("Category name is required");

  const res = await fetch(`${BASE_URL}/users/${userId}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: cleanName }),
  });

  if (!res.ok) throw new Error("Failed to create category");

  const data = await res.json();
  return {
    id: typeof data.id === "string" ? data.id : cleanName,
    name: cleanCategoryName(typeof data.name === "string" ? data.name : cleanName),
  };
}
