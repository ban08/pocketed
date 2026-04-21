export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}
export const isIncome = (e: Expense) => e.category === "Income";