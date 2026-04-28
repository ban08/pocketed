import { authReducer, initialState, AuthState } from "../authReducer";
import { User } from "../../models/User";

const sampleUser: User = {
  id: "u1",
  email: "user@example.com",
  name: "Sample User",
};

describe("authReducer", () => {
  it("starts unauthenticated with no user", () => {
    expect(initialState).toEqual({ isAuthenticated: false, user: null });
  });

  it("LOGIN sets isAuthenticated true and stores the user", () => {
    const next = authReducer(initialState, {
      type: "LOGIN",
      payload: sampleUser,
    });
    expect(next).toEqual({ isAuthenticated: true, user: sampleUser });
  });

  it("LOGOUT clears the user and sets isAuthenticated false", () => {
    const loggedIn: AuthState = { isAuthenticated: true, user: sampleUser };
    const next = authReducer(loggedIn, { type: "LOGOUT" });
    expect(next).toEqual({ isAuthenticated: false, user: null });
  });

  it("returns a new state object on LOGIN", () => {
    const next = authReducer(initialState, {
      type: "LOGIN",
      payload: sampleUser,
    });
    expect(next).not.toBe(initialState);
  });

  it("returns a new state object on LOGOUT", () => {
    const loggedIn: AuthState = { isAuthenticated: true, user: sampleUser };
    const next = authReducer(loggedIn, { type: "LOGOUT" });
    expect(next).not.toBe(loggedIn);
  });

  it("returns the same state for unknown actions", () => {
    const unknown = { type: "UNKNOWN" } as unknown as { type: "LOGOUT" };
    const next = authReducer(initialState, unknown);
    expect(next).toBe(initialState);
  });
});
