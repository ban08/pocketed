import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, DEFAULT_EXPENSE_CATEGORIES } from "../models/Category";

const storageKey = (userId: string) => `categories:${userId}`;

export function cleanCategoryName(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).join(" ");
}

export function mergeCategoryNames(...groups: (string | undefined)[][]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];

  groups.flat().forEach((name) => {
    const cleanName = cleanCategoryName(name ?? "");
    const key = cleanName.toLowerCase();
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

async function readStoredCategories(userId: string): Promise<Category[]> {
  const raw = await AsyncStorage.getItem(storageKey(userId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((category) => category && typeof category.name === "string")
      .map((category) => ({
        id: typeof category.id === "string" ? category.id : category.name,
        name: cleanCategoryName(category.name),
      }))
      .filter((category) => category.name.length > 0);
  } catch {
    return [];
  }
}

async function writeStoredCategories(userId: string, categories: Category[]): Promise<void> {
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(categories));
}

export async function getCategories(userId: string): Promise<Category[]> {
  return readStoredCategories(userId);
}

export async function createCategory(userId: string, name: string): Promise<Category> {
  const cleanName = cleanCategoryName(name);
  if (!cleanName) throw new Error("Category name is required");

  const existing = await readStoredCategories(userId);
  const duplicate = existing.find(
    (category) => category.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase()
  );
  if (duplicate) return duplicate;

  const created: Category = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: cleanName,
  };

  await writeStoredCategories(userId, [...existing, created]);
  return created;
}
