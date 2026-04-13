const BASE_URL = "http://<server-ip>:5022/api";

export async function getExpenses(userId: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}`);

  if (!res.ok) throw new Error("Failed to fetch user data");

  const data = await res.json();

  return data.expenses; 
}

export async function addExpense(userId: string, expense: {
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
    body: JSON.stringify(expense),
  });

  if (!res.ok) throw new Error("Failed to add expense");

  return await res.json();
}