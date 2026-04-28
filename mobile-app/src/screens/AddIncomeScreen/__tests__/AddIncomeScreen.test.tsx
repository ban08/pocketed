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

jest.mock("../../../services/expenseService", () => ({
  addIncome: jest.fn(),
}));

import { AuthContext } from "../../../context/AuthContext";
import { addIncome } from "../../../services/expenseService";
import AddIncomeScreen from "../AddIncomeScreen";

const renderWithUser = (user: { id: string; email: string; name: string } | null) => {
  const value = {
    isAuthenticated: !!user,
    user,
    login: jest.fn(),
    logout: jest.fn(),
  } as React.ContextType<typeof AuthContext>;
  return render(
    <AuthContext.Provider value={value}>
      <AddIncomeScreen />
    </AuthContext.Provider>
  );
};

const sampleUser = { id: "u1", email: "x@y.com", name: "User" };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

describe("AddIncomeScreen", () => {
  it("renders inputs and the save button", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    expect(getByTestId("income-title-input")).toBeTruthy();
    expect(getByTestId("income-amount-input")).toBeTruthy();
    expect(getByTestId("income-save-button")).toBeTruthy();
  });

  it("alerts when title or amount is empty", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.press(getByTestId("income-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please fill all fields");
    expect(addIncome).not.toHaveBeenCalled();
  });

  it("alerts when there is no logged-in user", () => {
    const { getByTestId } = renderWithUser(null);
    fireEvent.changeText(getByTestId("income-title-input"), "Salary");
    fireEvent.changeText(getByTestId("income-amount-input"), "1500");
    fireEvent.press(getByTestId("income-save-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "User not found");
    expect(addIncome).not.toHaveBeenCalled();
  });

  it("calls addIncome with the typed values and navigates back", async () => {
    (addIncome as jest.Mock).mockResolvedValueOnce({ id: "i1" });

    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.changeText(getByTestId("income-title-input"), "Salary");
    fireEvent.changeText(getByTestId("income-amount-input"), "1500");
    fireEvent.press(getByTestId("income-save-button"));

    await waitFor(() => expect(addIncome).toHaveBeenCalledTimes(1));
    const [userId, payload] = (addIncome as jest.Mock).mock.calls[0];
    expect(userId).toBe("u1");
    expect(payload.title).toBe("Salary");
    expect(payload.amount).toBe(1500);
    expect(payload.category).toBe("Income");
    expect(typeof payload.date).toBe("string");
    expect(mockBack).toHaveBeenCalled();
  });

  it("alerts and stays on screen when addIncome fails", async () => {
    (addIncome as jest.Mock).mockRejectedValueOnce(new Error("boom"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.changeText(getByTestId("income-title-input"), "Salary");
    fireEvent.changeText(getByTestId("income-amount-input"), "1500");
    fireEvent.press(getByTestId("income-save-button"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to save income")
    );
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("syncs the title when a quick category is tapped", () => {
    const { getByTestId } = renderWithUser(sampleUser);
    fireEvent.press(getByTestId("income-category-bonus"));
    expect(getByTestId("income-title-input").props.value).toBe("Bonus");
  });
});
