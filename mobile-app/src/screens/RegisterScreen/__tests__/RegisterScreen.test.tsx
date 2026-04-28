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

jest.mock("../../../services/authService", () => ({
  registerUser: jest.fn(),
  saveCurrentUser: jest.fn(),
}));

import { AuthContext } from "../../../context/AuthContext";
import { registerUser } from "../../../services/authService";
import RegisterScreen from "../RegisterScreen";

const renderWithAuth = () => {
  const value = {
    isAuthenticated: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  } as React.ContextType<typeof AuthContext>;
  const utils = render(
    <AuthContext.Provider value={value}>
      <RegisterScreen />
    </AuthContext.Provider>
  );
  return { ...utils, contextValue: value };
};

const fillForm = (
  getByTestId: ReturnType<typeof renderWithAuth>["getByTestId"],
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
    confirm: string;
  }> = {}
) => {
  const values = {
    name: "Alice",
    email: "a@b.com",
    password: "secret",
    confirm: "secret",
    ...overrides,
  };
  fireEvent.changeText(getByTestId("register-name-input"), values.name);
  fireEvent.changeText(getByTestId("register-email-input"), values.email);
  fireEvent.changeText(getByTestId("register-password-input"), values.password);
  fireEvent.changeText(
    getByTestId("register-confirm-password-input"),
    values.confirm
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

describe("RegisterScreen", () => {
  it("renders all form inputs and the submit button", () => {
    const { getByTestId } = renderWithAuth();
    expect(getByTestId("register-name-input")).toBeTruthy();
    expect(getByTestId("register-email-input")).toBeTruthy();
    expect(getByTestId("register-password-input")).toBeTruthy();
    expect(getByTestId("register-confirm-password-input")).toBeTruthy();
    expect(getByTestId("register-submit-button")).toBeTruthy();
  });

  it("alerts when any field is empty", () => {
    const { getByTestId } = renderWithAuth();
    fireEvent.press(getByTestId("register-submit-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "All fields are required.");
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("alerts when passwords do not match", () => {
    const { getByTestId } = renderWithAuth();
    fillForm(getByTestId, { confirm: "different" });
    fireEvent.press(getByTestId("register-submit-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Passwords do not match.");
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("calls registerUser and navigates to login with the email param", async () => {
    (registerUser as jest.Mock).mockResolvedValueOnce({
      id: "u1",
      email: "a@b.com",
      name: "Alice",
    });

    const { getByTestId } = renderWithAuth();
    fillForm(getByTestId);
    fireEvent.press(getByTestId("register-submit-button"));

    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith("Alice", "a@b.com", "secret")
    );
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/auth/login",
      params: { email: "a@b.com" },
    });
  });

  it("alerts and stays on screen when registration fails", async () => {
    (registerUser as jest.Mock).mockRejectedValueOnce(new Error("nope"));

    const { getByTestId } = renderWithAuth();
    fillForm(getByTestId);
    fireEvent.press(getByTestId("register-submit-button"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Registration failed. Please try again."
      )
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
