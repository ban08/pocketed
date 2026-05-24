import {
  getGreeting,
  formatCurrency,
  formatDate,
  getInitials,
  getSpentByCategory,
  groupExpensesByCategory,
  getBudgetPercent,
  getBudgetLevel,
  getBalanceLevel,
} from "../dashboardUtils";

const at = (hour: number) => new Date(2026, 3, 28, hour, 0, 0);

describe("getGreeting", () => {
  it("returns morning before noon", () => {
    expect(getGreeting(at(0))).toBe("Good morning");
    expect(getGreeting(at(11))).toBe("Good morning");
  });

  it("returns afternoon between noon and 6pm", () => {
    expect(getGreeting(at(12))).toBe("Good afternoon");
    expect(getGreeting(at(17))).toBe("Good afternoon");
  });

  it("returns evening from 6pm onward", () => {
    expect(getGreeting(at(18))).toBe("Good evening");
    expect(getGreeting(at(23))).toBe("Good evening");
  });
});

describe("formatCurrency", () => {
  it("includes the euro symbol", () => {
    expect(formatCurrency(10)).toMatch(/€/);
  });

  it("formats whole numbers", () => {
    expect(formatCurrency(1234)).toMatch(/1\.234/);
  });

  it("formats decimal values with two fraction digits", () => {
    expect(formatCurrency(12.5)).toMatch(/12,50/);
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toMatch(/0,00/);
  });

  it("formats negative values", () => {
    expect(formatCurrency(-7.25)).toMatch(/7,25/);
    expect(formatCurrency(-7.25)).toMatch(/-|−/);
  });
});

describe("formatDate", () => {
  it("formats a parseable ISO date", () => {
    expect(formatDate("2026-04-28")).toMatch(/28/);
    expect(formatDate("2026-04-28")).toMatch(/Apr/);
  });

  it("falls back to the original string when not parseable", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("falls back to empty string when input is empty", () => {
    expect(formatDate("")).toBe("");
  });
});

describe("getInitials", () => {
  it("returns the uppercased first letter of each word", () => {
    expect(getInitials("Alice Smith")).toBe("AS");
    expect(getInitials("alice mary smith")).toBe("AMS");
  });

  it("handles a single-word name", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("ignores extra spaces", () => {
    expect(getInitials("  Alice   Smith  ")).toBe("AS");
  });

  it("returns the U fallback for empty input", () => {
    expect(getInitials("")).toBe("U");
    expect(getInitials("   ")).toBe("U");
  });
});

describe("getSpentByCategory", () => {
  const expenses = [
    { category: "Food", amount: 10 },
    { category: "Food", amount: 5 },
    { category: "Travel", amount: 50 },
    { category: "Food", amount: -100 },
  ];

  it("sums positive amounts in the category", () => {
    expect(getSpentByCategory(expenses, "Food")).toBe(15);
  });

  it("ignores income (negative amounts) in the category", () => {
    expect(getSpentByCategory(expenses, "Food")).not.toBe(115);
  });

  it("ignores other categories", () => {
    expect(getSpentByCategory(expenses, "Travel")).toBe(50);
  });

  it("returns 0 for an unknown category", () => {
    expect(getSpentByCategory(expenses, "Health")).toBe(0);
  });

  it("returns 0 for an empty list", () => {
    expect(getSpentByCategory([], "Food")).toBe(0);
  });
});

describe("groupExpensesByCategory", () => {
  it("groups positive expenses by category and sorts by total spent", () => {
    const groups = groupExpensesByCategory([
      { title: "Lunch", category: "Food", amount: 10 },
      { title: "Dinner", category: "Food", amount: 15 },
      { title: "Bus", category: "Transport", amount: 5 },
      { title: "Salary", category: "Income", amount: -100 },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      category: "Food",
      total: 25,
      count: 2,
    });
    expect(groups[1]).toMatchObject({
      category: "Transport",
      total: 5,
      count: 1,
    });
  });

  it("uses Other when an expense has no category", () => {
    expect(groupExpensesByCategory([{ category: "", amount: 10 }])[0].category).toBe(
      "Other"
    );
  });

  it("normalizes category spacing and casing before grouping", () => {
    const groups = groupExpensesByCategory([
      { title: "Lunch", category: " Food ", amount: 10 },
      { title: "Dinner", category: "food", amount: 15 },
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      category: "Food",
      total: 25,
      count: 2,
    });
  });
});

describe("getBudgetPercent", () => {
  it("rounds to a whole percent", () => {
    expect(getBudgetPercent(33, 100)).toBe(33);
    expect(getBudgetPercent(1, 3)).toBe(33);
  });

  it("returns 0 when the limit is zero", () => {
    expect(getBudgetPercent(50, 0)).toBe(0);
  });

  it("returns 0 when the limit is negative", () => {
    expect(getBudgetPercent(50, -10)).toBe(0);
  });

  it("can exceed 100", () => {
    expect(getBudgetPercent(150, 100)).toBe(150);
  });
});

describe("getBudgetLevel", () => {
  it("returns ok below 80%", () => {
    expect(getBudgetLevel(0)).toBe("ok");
    expect(getBudgetLevel(79)).toBe("ok");
  });

  it("returns warn between 80 and 100%", () => {
    expect(getBudgetLevel(80)).toBe("warn");
    expect(getBudgetLevel(99)).toBe("warn");
  });

  it("returns over at or above 100%", () => {
    expect(getBudgetLevel(100)).toBe("over");
    expect(getBudgetLevel(150)).toBe("over");
  });
});

describe("getBalanceLevel", () => {
  it("returns positive for amounts above zero", () => {
    expect(getBalanceLevel(0.01)).toBe("positive");
    expect(getBalanceLevel(1000)).toBe("positive");
  });

  it("returns negative for amounts below zero", () => {
    expect(getBalanceLevel(-0.01)).toBe("negative");
    expect(getBalanceLevel(-1000)).toBe("negative");
  });

  it("returns neutral for exactly zero", () => {
    expect(getBalanceLevel(0)).toBe("neutral");
  });
});
