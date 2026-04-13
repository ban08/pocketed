import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  safeArea: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  label: {
    marginBottom: 6,
    color: "#374151",
    fontSize: 14,
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  buttonPrimary: {
    backgroundColor: "#6366F1",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonPrimaryPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },

  buttonSecondary: {
    marginTop: 12,
    alignItems: "center",
  },

  buttonSecondaryText: {
    color: "#6B7280",
    fontSize: 14,
  },
});