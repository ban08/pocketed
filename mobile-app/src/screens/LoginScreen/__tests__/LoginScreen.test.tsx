import * as React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
let mockParams: Record<string, string> = {};

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock("../../../services/authService", () => ({
  loginUser: jest.fn(),
  saveCurrentUser: jest.fn(),
}));

import { AuthContext } from "../../../context/AuthContext";
import { loginUser } from "../../../services/authService";
import LoginScreen from "../LoginScreen";

const renderWithAuth = (
  contextValue: Partial<React.ContextType<typeof AuthContext>> = {}
) => {
  const value = {
    isAuthenticated: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    ...contextValue,
  } as React.ContextType<typeof AuthContext>;
  const utils = render(
    <AuthContext.Provider value={value}>
      <LoginScreen />
    </AuthContext.Provider>
  );
  return { ...utils, contextValue: value };
};

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = {};
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

describe("LoginScreen", () => {
  it("renders inputs and the submit button", () => {
    const { getByTestId } = renderWithAuth();
    expect(getByTestId("login-email-input")).toBeTruthy();
    expect(getByTestId("login-password-input")).toBeTruthy();
    expect(getByTestId("login-submit-button")).toBeTruthy();
  });

  it("prefills the email from route params", () => {
    mockParams = { email: "x@y.com" };
    const { getByTestId } = renderWithAuth();
    expect(getByTestId("login-email-input").props.value).toBe("x@y.com");
  });

  it("alerts when email or password is empty", () => {
    const { getByTestId } = renderWithAuth();
    fireEvent.press(getByTestId("login-submit-button"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Email and password are required."
    );
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("calls loginUser, updates context, and navigates to tabs on success", async () => {
    const user = { id: "u1", email: "x@y.com", name: "User" };
    (loginUser as jest.Mock).mockResolvedValueOnce(user);

    const { getByTestId, contextValue } = renderWithAuth();
    fireEvent.changeText(getByTestId("login-email-input"), "x@y.com");
    fireEvent.changeText(getByTestId("login-password-input"), "secret");
    fireEvent.press(getByTestId("login-submit-button"));

    await waitFor(() => expect(loginUser).toHaveBeenCalledWith("x@y.com", "secret"));
    expect(contextValue.login).toHaveBeenCalledWith(user);
    expect(mockPush).toHaveBeenCalledWith("/(tabs)");
  });

  it("shows an alert on login failure and does not navigate", async () => {
    (loginUser as jest.Mock).mockRejectedValueOnce(new Error("nope"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    const { getByTestId, contextValue } = renderWithAuth();
    fireEvent.changeText(getByTestId("login-email-input"), "x@y.com");
    fireEvent.changeText(getByTestId("login-password-input"), "wrong");
    fireEvent.press(getByTestId("login-submit-button"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Login failed. Please check your credentials."
      )
    );
    expect(contextValue.login).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
