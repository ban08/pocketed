const BASE_URL = "http://91.98.197.3:5022/api";

export async function getUserData(userId: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  const data = await res.json();
  return {
    expenses: Array.isArray(data.expenses) ? data.expenses : [],
    budgets: Array.isArray(data.budgets) ? data.budgets : [],
  };
}

export async function addExpense(userId: string, expense: {
  title: string;
  amount: number;
  category: string;
  date: string;
}) {
  const normalizedAmount = Math.abs(expense.amount);
  const res = await fetch(`${BASE_URL}/users/${userId}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...expense, amount: normalizedAmount }),
  });
  if (!res.ok) throw new Error("Failed to add expense");
  return await res.json();
}

export function calculateSummary(expenses: any[]) {
  let income = 0;
  let spent = 0;

  expenses.forEach((e) => {
    if (e.amount < 0) {
      income += Math.abs(e.amount);
    } else {
      spent += e.amount;
    }
  });

  return {
    income,
    spent,
    balance: income - spent,
  };
}

export async function addIncome(userId: string, income: {
  title: string;
  amount: number;
  category: string;
  date: string;
}) {
  const res = await fetch(`${BASE_URL}/users/${userId}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...income,
      amount: -Math.abs(income.amount),
      date: income.date,
    }),
  });
  if (!res.ok) throw new Error("Failed to add income");
  return await res.json();
}