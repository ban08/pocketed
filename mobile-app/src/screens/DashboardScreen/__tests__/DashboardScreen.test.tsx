import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthContext } from "../../../context/AuthContext";
import { clearCurrentUser } from "../../../services/authService";
import { getUserData } from "../../../services/expenseService";
import DashboardScreen from "../DashboardScreen";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useFocusEffect: (cb: () => void) => {
    const ReactLib = require("react");
    ReactLib.useEffect(() => {
      cb();
    }, [cb]);
  },
}));

jest.mock("../../../services/authService", () => ({
  clearCurrentUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../../services/expenseService", () => ({
  getUserData: jest.fn(),
  calculateSummary: (expenses: { amount: number }[]) => {
    let income = 0;
    let spent = 0;
    expenses.forEach((e) => {
      if (e.amount < 0) income += Math.abs(e.amount);
      else spent += e.amount;
    });
    return { income, spent, balance: income - spent };
  },
}));

const sampleUser = { id: "u1", email: "x@y.com", name: "Alice Smith" };

const renderWithUser = (
  user: typeof sampleUser | null,
  logout: jest.Mock = jest.fn()
) => {
  const value = {
    isAuthenticated: !!user,
    user,
    login: jest.fn(),
    logout,
  } as React.ContextType<typeof AuthContext>;
  return {
    ...render(
      <AuthContext.Provider value={value}>
        <DashboardScreen />
      </AuthContext.Provider>
    ),
    logout,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
  (getUserData as jest.Mock).mockResolvedValue({ expenses: [], budgets: [] });
});

describe("DashboardScreen", () => {
  it("renders the action buttons and avatar with user initials", async () => {
    const { getByTestId, findByText } = renderWithUser(sampleUser);
    expect(getByTestId("dashboard-add-expense-button")).toBeTruthy();
    expect(getByTestId("dashboard-add-income-button")).toBeTruthy();
    expect(getByTestId("dashboard-add-budget-button")).toBeTruthy();
    expect(getByTestId("dashboard-categories-button")).toBeTruthy();
    expect(getByTestId("dashboard-profile-button")).toBeTruthy();
    expect(getByTestId("dashboard-logout-button")).toBeTruthy();
    expect(await findByText("AS")).toBeTruthy();
  });

  it("shows the empty state when there are no expenses", async () => {
    const { findByText } = renderWithUser(sampleUser);
    expect(await findByText("No transactions yet")).toBeTruthy();
  });

  it("renders income, spent, and balance from mocked API data", async () => {
    (getUserData as jest.Mock).mockResolvedValue({
      expenses: [
        { id: "e1", title: "Salary", amount: -1000, category: "Income", date: "2026-04-01" },
        { id: "e2", title: "Lunch", amount: 25, category: "Food", date: "2026-04-02" },
        { id: "e3", title: "Bus", amount: 5, category: "Transport", date: "2026-04-03" },
      ],
      budgets: [
        { id: "b1", category: "Food", limit: 200 },
      ],
    });

    const { getByTestId } = renderWithUser(sampleUser);
    await waitFor(() => {
      expect(getByTestId("dashboard-income-value").props.children).toMatch(/1\.000/);
      expect(getByTestId("dashboard-spent-value").props.children).toMatch(/30,00/);
      expect(getByTestId("dashboard-balance-value").props.children).toMatch(/970/);
      expect(getByTestId("dashboard-remaining-value").props.children).toMatch(/170/);
    });
  });

  it("groups positive expenses by category on the dashboard", async () => {
    (getUserData as jest.Mock).mockResolvedValue({
      expenses: [
        { id: "e1", title: "Lunch", amount: 25, category: "Food", date: "2026-04-02" },
        { id: "e2", title: "Dinner", amount: 10, category: "Food", date: "2026-04-03" },
        { id: "e3", title: "Salary", amount: -1000, category: "Income", date: "2026-04-01" },
      ],
      budgets: [],
    });

    const { findByTestId, findByText } = renderWithUser(sampleUser);
    expect(await findByTestId("dashboard-category-group-food")).toBeTruthy();
    expect(await findByText("2 expenses")).toBeTruthy();
  });

  it("navigates to add screens when quick actions are pressed", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    await waitFor(() => expect(getUserData).toHaveBeenCalled());

    fireEvent.press(getByTestId("dashboard-add-expense-button"));
    fireEvent.press(getByTestId("dashboard-add-income-button"));
    fireEvent.press(getByTestId("dashboard-add-budget-button"));
    fireEvent.press(getByTestId("dashboard-categories-button"));
    expect(mockPush).toHaveBeenCalledWith("/add-expense");
    expect(mockPush).toHaveBeenCalledWith("/add-income");
    expect(mockPush).toHaveBeenCalledWith("/add-budget");
    expect(mockPush).toHaveBeenCalledWith("/categories");
  });

  it("opens the profile when the avatar is pressed", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    await waitFor(() => expect(getUserData).toHaveBeenCalled());
    fireEvent.press(getByTestId("dashboard-profile-button"));
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/profile");
  });

  it("clears current user, calls logout, and navigates to login on logout press", async () => {
    const logout = jest.fn();
    const { getByTestId } = renderWithUser(sampleUser, logout);
    await waitFor(() => expect(getUserData).toHaveBeenCalled());

    fireEvent.press(getByTestId("dashboard-logout-button"));

    await waitFor(() => expect(clearCurrentUser).toHaveBeenCalledTimes(1));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
  });

  it("does not call getUserData when there is no user id", async () => {
    renderWithUser(null);
    // Allow effects to run.
    await waitFor(() => {
      expect(getUserData).not.toHaveBeenCalled();
    });
  });

  it("logs but does not crash when getUserData fails", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getUserData as jest.Mock).mockRejectedValueOnce(new Error("boom"));

    const { findByText } = renderWithUser(sampleUser);
    expect(await findByText("No transactions yet")).toBeTruthy();
    expect(errSpy).toHaveBeenCalled();
  });
});
