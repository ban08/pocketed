import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthContext } from "../../../context/AuthContext";
import { clearCurrentUser } from "../../../services/authService";
import { getUserData } from "../../../services/expenseService";
import UserProfileScreen from "../UserProfileScreen";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useFocusEffect: (cb: () => void | (() => void)) => {
    const ReactLib = require("react");
    ReactLib.useEffect(() => cb(), [cb]);
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

const sampleUser = { id: "u1", email: "alice@example.com", name: "Alice Smith" };

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
        <UserProfileScreen />
      </AuthContext.Provider>
    ),
    logout,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
  (getUserData as jest.Mock).mockResolvedValue({ expenses: [], budgets: [] });
});

describe("UserProfileScreen", () => {
  it("renders the user name, email, and computed initials", () => {
    (getUserData as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    const { getByText, getAllByText } = renderWithUser(sampleUser);
    // Name appears twice: hero card + "Full Name" account row.
    expect(getAllByText("Alice Smith").length).toBeGreaterThanOrEqual(2);
    expect(getAllByText("alice@example.com").length).toBeGreaterThanOrEqual(2);
    expect(getByText("AS")).toBeTruthy();
  });

  it("falls back to 'User' label and 'U' initials when no user is set", () => {
    const { getByText, getAllByText } = renderWithUser(null);
    expect(getAllByText("User").length).toBeGreaterThanOrEqual(2);
    expect(getByText("U")).toBeTruthy();
    expect(getUserData).not.toHaveBeenCalled();
  });

  it("renders summary values from getUserData", async () => {
    (getUserData as jest.Mock).mockResolvedValue({
      expenses: [
        { amount: -1000 },
        { amount: 200 },
        { amount: 50 },
      ],
      budgets: [],
    });

    const { getByText } = renderWithUser(sampleUser);
    await waitFor(() => {
      expect(getByText(/1\.000/)).toBeTruthy(); // income
      expect(getByText(/250/)).toBeTruthy();    // spent
      expect(getByText(/750/)).toBeTruthy();    // balance
    });
  });

  it("shows the '—' placeholder when getUserData fails", async () => {
    (getUserData as jest.Mock).mockRejectedValueOnce(new Error("offline"));

    const { findAllByText } = renderWithUser(sampleUser);
    const dashes = await findAllByText("—");
    // Income, Spent, Balance all stay null and render "—".
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });

  it("clears current user, calls logout, and routes to login on sign out", async () => {
    const logout = jest.fn();
    const { getByTestId } = renderWithUser(sampleUser, logout);
    await waitFor(() => expect(getUserData).toHaveBeenCalled());

    fireEvent.press(getByTestId("profile-sign-out-button"));

    await waitFor(() => expect(clearCurrentUser).toHaveBeenCalledTimes(1));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
  });
});
