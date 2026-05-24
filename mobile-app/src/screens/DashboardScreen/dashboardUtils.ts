import { getCategoryKey, normalizeCategoryName } from "@/src/utils/categoryColor";

export type BudgetLevel = "ok" | "warn" | "over";
export type BalanceLevel = "positive" | "negative" | "neutral";

export interface CategoryExpenseGroup<T extends { category: string; amount: number }> {
  category: string;
  total: number;
  count: number;
  expenses: T[];
}

export function getGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

export function formatDate(d: string): string {
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return initials || "U";
}

export function getSpentByCategory(
  expenses: { category: string; amount: number }[],
  category: string
): number {
  return expenses
    .filter((e) => e.category === category && e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function groupExpensesByCategory<T extends { category: string; amount: number }>(
  expenses: T[]
): CategoryExpenseGroup<T>[] {
  const groups = new Map<string, CategoryExpenseGroup<T>>();

  expenses
    .filter((expense) => expense.amount > 0)
    .forEach((expense) => {
      const category = normalizeCategoryName(expense.category);
      const key = getCategoryKey(category);
      const existing = groups.get(key) ?? {
        category,
        total: 0,
        count: 0,
        expenses: [],
      };

      existing.total += expense.amount;
      existing.count += 1;
      existing.expenses.push(expense);
      groups.set(key, existing);
    });

  return Array.from(groups.values()).sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.category.localeCompare(b.category);
  });
}

export function getBudgetPercent(spent: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.round((spent / limit) * 100);
}

export function getBudgetLevel(percent: number): BudgetLevel {
  if (percent >= 100) return "over";
  if (percent >= 80) return "warn";
  return "ok";
}

export function getBalanceLevel(balance: number): BalanceLevel {
  if (balance > 0) return "positive";
  if (balance < 0) return "negative";
  return "neutral";
}
