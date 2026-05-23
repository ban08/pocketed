import * as React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthContext } from "../../../context/AuthContext";
import { addExpense } from "../../../services/expenseService";
import { getCategories } from "../../../services/categoryService";
import AddExpenseScreen from "../AddExpenseScreen";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => ({}),
}));

jest.mock("../../../services/expenseService", () => ({
  addExpense: jest.fn(),
}));

jest.mock("../../../services/categoryService", () => {
  const actual = jest.requireActual("../../../services/categoryService");
  return {
    ...actual,
    getCategories: jest.fn(),
  };
});

const renderWithUser = (user: { id: string; email: string; name: string } | null) => {
  const value = {
    isAuthenticated: !!user,
    user,
    login: jest.fn(),
    logout: jest.fn(),
  } as React.ContextType<typeof AuthContext>;
  return render(
    <AuthContext.Provider value={value}>
      <AddExpenseScreen />
    </AuthContext.Provider>
  );
};

const sampleUser = { id: "u1", email: "x@y.com", name: "User" };
const waitForLoadedCategories = async (getByTestId: (id: string) => unknown) => {
  await waitFor(() => expect(getByTestId("expense-category-option-utilities")).toBeTruthy());
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
  (addExpense as jest.Mock).mockResolvedValue({ id: "e1" });
  (getCategories as jest.Mock).mockResolvedValue([
    { id: "food", name: "Food" },
    { id: "utilities", name: "Utilities" },
  ]);
});

describe("AddExpenseScreen", () => {
  it("renders inputs and the save button", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    await waitForLoadedCategories(getByTestId);
    expect(getByTestId("expense-title-input")).toBeTruthy();
    expect(getByTestId("expense-amount-input")).toBeTruthy();
    expect(getByTestId("expense-category-input")).toBeTruthy();
    expect(getByTestId("expense-save-button")).toBeTruthy();
  });

  it("alerts when any field is empty", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    await waitForLoadedCategories(getByTestId);
    fireEvent.press(getByTestId("expense-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please fill all fields");
    expect(addExpense).not.toHaveBeenCalled();
  });

  it("alerts when there is no logged-in user", () => {
    const { getByTestId } = renderWithUser(null);
    fireEvent.changeText(getByTestId("expense-title-input"), "Lunch");
    fireEvent.changeText(getByTestId("expense-amount-input"), "12.5");
    fireEvent.changeText(getByTestId("expense-category-input"), "Food");
    fireEvent.press(getByTestId("expense-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "User not found");
    expect(addExpense).not.toHaveBeenCalled();
  });

  it("posts the expense and navigates back on success", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    await waitForLoadedCategories(getByTestId);
    fireEvent.changeText(getByTestId("expense-title-input"), "Lunch");
    fireEvent.changeText(getByTestId("expense-amount-input"), "12.5");
    fireEvent.changeText(getByTestId("expense-category-input"), "Food");
    fireEvent.press(getByTestId("expense-save-button"));

    await waitFor(() => expect(addExpense).toHaveBeenCalledTimes(1));
    const [userId, body] = (addExpense as jest.Mock).mock.calls[0];
    expect(userId).toBe("u1");
    expect(body.title).toBe("Lunch");
    expect(body.amount).toBe(12.5);
    expect(body.category).toBe("Food");
    expect(typeof body.date).toBe("string");
    expect(mockBack).toHaveBeenCalled();
  });

  it("loads category options and assigns a category from a pill", async () => {
    const { findByText, getByTestId } = renderWithUser(sampleUser);

    expect(await findByText("Utilities")).toBeTruthy();
    fireEvent.press(getByTestId("expense-category-option-utilities"));
    expect(getByTestId("expense-category-input").props.value).toBe("Utilities");
  });

  it("navigates back when cancel is pressed", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    await waitForLoadedCategories(getByTestId);
    fireEvent.press(getByTestId("expense-cancel-button"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("alerts and stays on screen when fetch rejects", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (addExpense as jest.Mock).mockRejectedValueOnce(new Error("network down"));

    const { getByTestId } = renderWithUser(sampleUser);
    await waitForLoadedCategories(getByTestId);
    fireEvent.changeText(getByTestId("expense-title-input"), "Lunch");
    fireEvent.changeText(getByTestId("expense-amount-input"), "12.5");
    fireEvent.changeText(getByTestId("expense-category-input"), "Food");
    fireEvent.press(getByTestId("expense-save-button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to save expense");
    });
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("passes NaN when amount is non-numeric (regression pin for missing validation)", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    await waitForLoadedCategories(getByTestId);
    fireEvent.changeText(getByTestId("expense-title-input"), "Lunch");
    fireEvent.changeText(getByTestId("expense-amount-input"), "abc");
    fireEvent.changeText(getByTestId("expense-category-input"), "Food");
    fireEvent.press(getByTestId("expense-save-button"));

    await waitFor(() => expect(addExpense).toHaveBeenCalledTimes(1));
    const [, body] = (addExpense as jest.Mock).mock.calls[0];
    expect(Number.isNaN(body.amount)).toBe(true);
  });
});
