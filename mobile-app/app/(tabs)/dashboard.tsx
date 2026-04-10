import { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import DashboardScreen from "@/src/screens/DashboardScreen/DashboardScreen";

export default function HomeScreen() {

  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect href="/auth/welcome" />;
  }

  return (
    <DashboardScreen />
  );
}
