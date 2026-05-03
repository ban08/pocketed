import * as React from "react";
import { useContext } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, waitFor, act } from "@testing-library/react-native";
import { AuthProvider, AuthContext } from "../AuthContext";

const Probe = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  return (
    <Text testID="auth-probe">
      {isAuthenticated ? `auth:${user?.name ?? ""}` : "anon"}
    </Text>
  );
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("AuthProvider", () => {
  const probeText = (node: { props: { children: unknown } }): string => {
    const { children } = node.props;
    if (Array.isArray(children)) return children.join("");
    return String(children ?? "");
  };

  it("starts unauthenticated when AsyncStorage is empty", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(probeText(getByTestId("auth-probe"))).toBe("anon");
  });

  it("hydrates the user from AsyncStorage on mount", async () => {
    await AsyncStorage.setItem(
      "current_user",
      JSON.stringify({ id: "u1", email: "a@b.com", name: "Alice" })
    );

    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(probeText(getByTestId("auth-probe"))).toBe("auth:Alice");
    });
  });

  it("login() and logout() update the context state", async () => {
    let captured: React.ContextType<typeof AuthContext> | null = null;
    const Capture = () => {
      captured = useContext(AuthContext);
      return <Text testID="auth-capture">ok</Text>;
    };

    render(
      <AuthProvider>
        <Capture />
      </AuthProvider>
    );

    // Wait for the initial useEffect to settle.
    await waitFor(() => expect(captured).not.toBeNull());

    await act(async () => {
      captured!.login({ id: "u9", email: "x@y.com", name: "Xander" });
    });
    expect(captured!.isAuthenticated).toBe(true);
    expect(captured!.user).toEqual({ id: "u9", email: "x@y.com", name: "Xander" });

    await act(async () => {
      captured!.logout();
    });
    expect(captured!.isAuthenticated).toBe(false);
    expect(captured!.user).toBeNull();
  });
});
