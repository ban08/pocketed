import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  clearCurrentUser,
} from "../authService";

const mockFetch = (responses: { ok: boolean; body?: any }[]) => {
  const fn = jest.fn();
  responses.forEach((r) => {
    fn.mockResolvedValueOnce({
      ok: r.ok,
      json: async () => r.body ?? {},
    });
  });
  global.fetch = fn as unknown as typeof fetch;
  return fn;
};

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

describe("registerUser", () => {
  it("posts name, email and password, then fetches the full user", async () => {
    const fetchMock = mockFetch([
      { ok: true, body: { id: "u1" } },
      { ok: true, body: { id: "u1", email: "a@b.com", name: "Alice" } },
    ]);

    const user = await registerUser("Alice", "a@b.com", "secret");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [registerUrl, registerInit] = fetchMock.mock.calls[0];
    expect(registerUrl).toMatch(/\/users\/register$/);
    expect(registerInit.method).toBe("POST");
    expect(JSON.parse(registerInit.body)).toEqual({
      name: "Alice",
      email: "a@b.com",
      password: "secret",
    });

    const [getUrl] = fetchMock.mock.calls[1];
    expect(getUrl).toMatch(/\/users\/u1$/);

    expect(user).toEqual({ id: "u1", email: "a@b.com", name: "Alice" });
  });

  it("stores the registered user in AsyncStorage", async () => {
    mockFetch([
      { ok: true, body: { id: "u1" } },
      { ok: true, body: { id: "u1", email: "a@b.com", name: "Alice" } },
    ]);

    await registerUser("Alice", "a@b.com", "secret");

    const stored = await AsyncStorage.getItem("current_user");
    expect(JSON.parse(stored as string)).toEqual({
      id: "u1",
      email: "a@b.com",
      name: "Alice",
    });
  });

  it("throws when registration fails", async () => {
    mockFetch([{ ok: false }]);
    await expect(registerUser("a", "b@c.com", "p")).rejects.toThrow(
      "Registration failed"
    );
  });
});

describe("loginUser", () => {
  it("posts email and password and returns the full user", async () => {
    const fetchMock = mockFetch([
      { ok: true, body: { id: "u9" } },
      { ok: true, body: { id: "u9", email: "x@y.com", name: "Xander" } },
    ]);

    const user = await loginUser("x@y.com", "pw");

    const [loginUrl, loginInit] = fetchMock.mock.calls[0];
    expect(loginUrl).toMatch(/\/users\/login$/);
    expect(JSON.parse(loginInit.body)).toEqual({
      email: "x@y.com",
      password: "pw",
    });

    expect(user).toEqual({ id: "u9", email: "x@y.com", name: "Xander" });
  });

  it("stores the logged-in user in AsyncStorage", async () => {
    mockFetch([
      { ok: true, body: { id: "u9" } },
      { ok: true, body: { id: "u9", email: "x@y.com", name: "Xander" } },
    ]);

    await loginUser("x@y.com", "pw");

    const stored = await AsyncStorage.getItem("current_user");
    expect(JSON.parse(stored as string)).toEqual({
      id: "u9",
      email: "x@y.com",
      name: "Xander",
    });
  });

  it("throws on invalid credentials", async () => {
    mockFetch([{ ok: false }]);
    await expect(loginUser("x@y.com", "wrong")).rejects.toThrow(
      "Invalid email or password"
    );
  });
});

describe("session helpers", () => {
  it("getCurrentUser returns null when storage is empty", async () => {
    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it("getCurrentUser parses the stored JSON", async () => {
    await AsyncStorage.setItem(
      "current_user",
      JSON.stringify({ id: "u1", email: "a@b.com", name: "Alice" })
    );
    await expect(getCurrentUser()).resolves.toEqual({
      id: "u1",
      email: "a@b.com",
      name: "Alice",
    });
  });

  it("clearCurrentUser removes current_user", async () => {
    await AsyncStorage.setItem("current_user", JSON.stringify({ id: "u1" }));
    await clearCurrentUser();
    await expect(AsyncStorage.getItem("current_user")).resolves.toBeNull();
  });
});
