import {
  getUserData,
  addExpense,
  addIncome,
  calculateSummary,
} from "../expenseService";

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

describe("calculateSummary", () => {
  it("returns zero values for an empty list", () => {
    expect(calculateSummary([])).toEqual({ income: 0, spent: 0, balance: 0 });
  });

  it("counts positive amounts as spent", () => {
    expect(
      calculateSummary([
        { amount: 10 },
        { amount: 25.5 },
      ])
    ).toEqual({ income: 0, spent: 35.5, balance: -35.5 });
  });

  it("counts negative amounts as income", () => {
    expect(
      calculateSummary([
        { amount: -100 },
        { amount: -50 },
      ])
    ).toEqual({ income: 150, spent: 0, balance: 150 });
  });

  it("computes the balance for mixed income and expenses", () => {
    const summary = calculateSummary([
      { amount: -200 },
      { amount: 30 },
      { amount: 70 },
      { amount: -100 },
    ]);
    expect(summary).toEqual({ income: 300, spent: 100, balance: 200 });
  });

  it("preserves decimal precision for typical financial values", () => {
    const summary = calculateSummary([
      { amount: -10.25 },
      { amount: 4.5 },
    ]);
    expect(summary.income).toBeCloseTo(10.25, 2);
    expect(summary.spent).toBeCloseTo(4.5, 2);
    expect(summary.balance).toBeCloseTo(5.75, 2);
  });
});

describe("getUserData", () => {
  it("returns expenses and budgets arrays from the API response", async () => {
    mockFetch({
      ok: true,
      body: {
        expenses: [{ id: "e1", amount: 10 }],
        budgets: [{ id: "b1", limit: 100 }],
      },
    });

    const data = await getUserData("u1");
    expect(data.expenses).toHaveLength(1);
    expect(data.budgets).toHaveLength(1);
  });

  it("falls back to empty arrays when fields are missing", async () => {
    mockFetch({ ok: true, body: {} });
    const data = await getUserData("u1");
    expect(data).toEqual({ expenses: [], budgets: [] });
  });

  it("falls back to empty arrays when fields are not arrays", async () => {
    mockFetch({ ok: true, body: { expenses: null, budgets: "nope" } });
    const data = await getUserData("u1");
    expect(data).toEqual({ expenses: [], budgets: [] });
  });

  it("throws when the response is not ok", async () => {
    mockFetch({ ok: false });
    await expect(getUserData("u1")).rejects.toThrow("Failed to fetch user data");
  });
});

describe("addExpense", () => {
  it("posts an absolute positive amount even when input is negative", async () => {
    const fetchMock = mockFetch({ ok: true, body: { id: "e1" } });

    await addExpense("u1", {
      title: "Lunch",
      amount: -12.5,
      category: "Food",
      date: "2026-04-28",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/users\/u1\/expenses$/);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      title: "Lunch",
      amount: 12.5,
      category: "Food",
      date: "2026-04-28",
    });
  });

  it("throws when the API responds with an error", async () => {
    mockFetch({ ok: false });
    await expect(
      addExpense("u1", {
        title: "x",
        amount: 1,
        category: "Misc",
        date: "2026-04-28",
      })
    ).rejects.toThrow("Failed to add expense");
  });
});

describe("addIncome", () => {
  it("posts a negative absolute amount", async () => {
    const fetchMock = mockFetch({ ok: true, body: { id: "e2" } });

    await addIncome("u1", {
      title: "Salary",
      amount: 1500,
      category: "Income",
      date: "2026-04-28",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/users\/u1\/expenses$/);
    const body = JSON.parse(init.body);
    expect(body.amount).toBe(-1500);
    expect(body.title).toBe("Salary");
    expect(body.category).toBe("Income");
    expect(body.date).toBe("2026-04-28");
  });

  it("normalizes already-negative input to a single negative amount", async () => {
    const fetchMock = mockFetch({ ok: true, body: { id: "e2" } });

    await addIncome("u1", {
      title: "Refund",
      amount: -200,
      category: "Income",
      date: "2026-04-28",
    });

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body).amount).toBe(-200);
  });

  it("throws when the API responds with an error", async () => {
    mockFetch({ ok: false });
    await expect(
      addIncome("u1", {
        title: "x",
        amount: 10,
        category: "Income",
        date: "2026-04-28",
      })
    ).rejects.toThrow("Failed to add income");
  });
});
