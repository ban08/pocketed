import * as React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => ({}),
}));

import { AuthContext } from "../../../context/AuthContext";
import AddExpenseScreen from "../AddExpenseScreen";

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

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: "e1" }),
  }) as unknown as typeof fetch;
});

describe("AddExpenseScreen", () => {
  it("renders inputs and the save button", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    expect(getByTestId("expense-title-input")).toBeTruthy();
    expect(getByTestId("expense-amount-input")).toBeTruthy();
    expect(getByTestId("expense-category-input")).toBeTruthy();
    expect(getByTestId("expense-save-button")).toBeTruthy();
  });

  it("alerts when any field is empty", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.press(getByTestId("expense-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please fill all fields");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("alerts when there is no logged-in user", () => {
    const { getByTestId } = renderWithUser(null);
    fireEvent.changeText(getByTestId("expense-title-input"), "Lunch");
    fireEvent.changeText(getByTestId("expense-amount-input"), "12.5");
    fireEvent.changeText(getByTestId("expense-category-input"), "Food");
    fireEvent.press(getByTestId("expense-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "User not found");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("posts the expense and navigates back on success", async () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.changeText(getByTestId("expense-title-input"), "Lunch");
    fireEvent.changeText(getByTestId("expense-amount-input"), "12.5");
    fireEvent.changeText(getByTestId("expense-category-input"), "Food");
    fireEvent.press(getByTestId("expense-save-button"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toMatch(/\/users\/u1\/expenses$/);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.title).toBe("Lunch");
    expect(body.amount).toBe(12.5);
    expect(body.category).toBe("Food");
    expect(typeof body.date).toBe("string");
    expect(mockBack).toHaveBeenCalled();
  });

  it("navigates back when cancel is pressed", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.press(getByTestId("expense-cancel-button"));
    expect(mockBack).toHaveBeenCalled();
  });
});
