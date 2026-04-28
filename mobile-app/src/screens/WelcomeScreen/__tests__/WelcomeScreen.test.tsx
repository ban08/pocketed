import * as React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WelcomeScreen from "../WelcomeScreen";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => ({}),
}));

beforeEach(() => {
  mockPush.mockClear();
  mockReplace.mockClear();
  mockBack.mockClear();
});

describe("WelcomeScreen", () => {
  it("renders the register, login, and guest buttons", () => {
    const { getByTestId } = render(<WelcomeScreen />);
    expect(getByTestId("welcome-register-button")).toBeTruthy();
    expect(getByTestId("welcome-login-button")).toBeTruthy();
    expect(getByTestId("welcome-guest-button")).toBeTruthy();
  });

  it("navigates to /auth/register when register is pressed", () => {
    const { getByTestId } = render(<WelcomeScreen />);
    fireEvent.press(getByTestId("welcome-register-button"));
    expect(mockPush).toHaveBeenCalledWith("/auth/register");
  });

  it("navigates to /auth/login when login is pressed", () => {
    const { getByTestId } = render(<WelcomeScreen />);
    fireEvent.press(getByTestId("welcome-login-button"));
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });

  it("navigates to /(tabs) when guest is pressed", () => {
    const { getByTestId } = render(<WelcomeScreen />);
    fireEvent.press(getByTestId("welcome-guest-button"));
    expect(mockPush).toHaveBeenCalledWith("/(tabs)");
  });
});
