import * as React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthContext } from "../../../context/AuthContext";
import { getUserData } from "../../../services/expenseService";
import { createCategory } from "../../../services/categoryService";
import CategoryManagementScreen from "../CategoryManagementScreen";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack }),
  useFocusEffect: (cb: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ReactLib = require("react");
    ReactLib.useEffect(() => {
      cb();
    }, [cb]);
  },
}));

jest.mock("../../../services/expenseService", () => ({
  getUserData: jest.fn(),
}));

jest.mock("../../../services/categoryService", () => {
  const actual = jest.requireActual("../../../services/categoryService");
  return {
    ...actual,
    createCategory: jest.fn(),
  };
});

const sampleUser = { id: "u1", email: "x@y.com", name: "User" };

const renderWithUser = (user: typeof sampleUser | null = sampleUser) => {
  const value = {
    isAuthenticated: !!user,
    user,
    login: jest.fn(),
    logout: jest.fn(),
  } as React.ContextType<typeof AuthContext>;

  return render(
    <AuthContext.Provider value={value}>
      <CategoryManagementScreen />
    </AuthContext.Provider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
  (getUserData as jest.Mock).mockResolvedValue({
    categories: [{ id: "c1", name: "Food" }],
    expenses: [
      { id: "e1", title: "Lunch", amount: 20, category: "Food", date: "2026-04-02" },
      { id: "e2", title: "Salary", amount: -1000, category: "Income", date: "2026-04-01" },
    ],
    budgets: [],
  });
  (createCategory as jest.Mock).mockResolvedValue({ id: "c2", name: "Rent" });
});

describe("CategoryManagementScreen", () => {
  it("renders loaded categories with grouped expense totals", async () => {
    const { findByTestId, findByText } = renderWithUser();

    expect(await findByTestId("category-row-food")).toBeTruthy();
    expect(await findByText("1 expense")).toBeTruthy();
    expect(await findByText(/20,00/)).toBeTruthy();
  });

  it("creates a new category", async () => {
    const { getByTestId, findByTestId } = renderWithUser();
    await findByTestId("category-row-food");

    fireEvent.changeText(getByTestId("category-name-input"), " Rent ");
    fireEvent.press(getByTestId("category-create-button"));

    await waitFor(() => expect(createCategory).toHaveBeenCalledWith("u1", "Rent"));
    expect(await findByTestId("category-row-rent")).toBeTruthy();
  });

  it("alerts when creating a blank category", async () => {
    const { getByTestId, findByTestId } = renderWithUser();
    await findByTestId("category-row-food");

    fireEvent.press(getByTestId("category-create-button"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please enter a category name"
    );
    expect(createCategory).not.toHaveBeenCalled();
  });

  it("navigates back from the header button", async () => {
    const { getByLabelText, findByTestId } = renderWithUser();
    await findByTestId("category-row-food");

    fireEvent.press(getByLabelText("Go back"));
    expect(mockBack).toHaveBeenCalled();
  });
});
