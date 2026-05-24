const FALLBACK_CATEGORY_COLORS = [
  "#7BE3B5",
  "#F4A988",
  "#88B7F4",
  "#C8A0F2",
  "#F2D27A",
  "#F87171",
];

function categoryHash(category: string): number {
  return category
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function normalizeCategoryName(category?: string): string {
  const cleanName = (category ?? "").trim().split(/\s+/).filter(Boolean).join(" ");
  return cleanName || "Other";
}

export function getCategoryKey(category?: string): string {
  return normalizeCategoryName(category).toLowerCase();
}

export function categoryTestId(category?: string): string {
  const normalized = normalizeCategoryName(category);
  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (slug) return slug;
  return `unknown-${categoryHash(normalized).toString(36)}`;
}

export function getCategoryFallbackColor(category: string): string {
  const hash = categoryHash(normalizeCategoryName(category));
  return FALLBACK_CATEGORY_COLORS[hash % FALLBACK_CATEGORY_COLORS.length];
}
