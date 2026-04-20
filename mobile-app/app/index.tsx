import * as React from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";

export default function Index() {
  const { isAuthenticated, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return null;
  }

  return (
    <Redirect href={isAuthenticated ? "/(tabs)/dashboard" : "/auth/welcome"} />
  );
}
