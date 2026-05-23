const FALLBACK_CATEGORY_COLORS = [
  "#7BE3B5",
  "#F4A988",
  "#88B7F4",
  "#C8A0F2",
  "#F2D27A",
  "#F87171",
];

export function getCategoryFallbackColor(category: string): string {
  const hash = category
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FALLBACK_CATEGORY_COLORS[hash % FALLBACK_CATEGORY_COLORS.length];
}
