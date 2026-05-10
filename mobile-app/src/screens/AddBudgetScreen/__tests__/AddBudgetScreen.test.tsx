import * as React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthContext } from "../../../context/AuthContext";
import AddBudgetScreen from "../AddBudgetScreen";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => ({}),
}));

const renderWithUser = (user: { id: string; email: string; name: string } | null) => {
  const value = {
    isAuthenticated: !!user,
    user,
    login: jest.fn(),
    logout: jest.fn(),
  } as React.ContextType<typeof AuthContext>;
  return render(
    <AuthContext.Provider value={value}>
      <AddBudgetScreen />
    </AuthContext.Provider>
  );
};

const sampleUser = { id: "u1", email: "x@y.com", name: "User" };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: "b1" }),
  }) as unknown as typeof fetch;
});

describe("AddBudgetScreen", () => {
  it("renders inputs and the save button", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    expect(getByTestId("budget-category-input")).toBeTruthy();
    expect(getByTestId("budget-limit-input")).toBeTruthy();
    expect(getByTestId("budget-save-button")).toBeTruthy();
  });

  it("alerts when category or limit is empty", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.press(getByTestId("budget-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please fill all fields");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("alerts when there is no logged-in user", () => {
    const { getByTestId } = renderWithUser(null);
    fireEvent.changeText(getByTestId("budget-category-input"), "Food");
    fireEvent.changeText(getByTestId("budget-limit-input"), "300");
    fireEvent.press(getByTestId("budget-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "User not found");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("posts the budget with monthly period and navigates back", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.changeText(getByTestId("budget-category-input"), "Food");
    fireEvent.changeText(getByTestId("budget-limit-input"), "300");
    fireEvent.press(getByTestId("budget-save-button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toMatch(/\/users\/u1\/budgets$/);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body).toEqual({ category: "Food", limit: 300, period: "monthly" });
    expect(mockBack).toHaveBeenCalled();
  });

  it("navigates back when cancel is pressed", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.press(getByTestId("budget-cancel-button"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("alerts and stays on screen when fetch rejects", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("network down")) as unknown as typeof fetch;

    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.changeText(getByTestId("budget-category-input"), "Food");
    fireEvent.changeText(getByTestId("budget-limit-input"), "300");
    fireEvent.press(getByTestId("budget-save-button"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to save budget"
      )
    );
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("posts NaN when limit is non-numeric (regression pin for missing validation)", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.changeText(getByTestId("budget-category-input"), "Food");
    fireEvent.changeText(getByTestId("budget-limit-input"), "abc");
    fireEvent.press(getByTestId("budget-save-button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(init.body);
    // Pin current buggy behavior: Number("abc") -> NaN -> JSON null.
    expect(body.limit).toBeNull();
  });
});
