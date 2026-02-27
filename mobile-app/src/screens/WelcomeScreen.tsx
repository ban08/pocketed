import { spacing } from "@/src/theme/spacing";
import * as React from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const userName = "User";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safe}>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>P4</Text>
          </View>
          <Text style={styles.brandText}>Pocket4Students</Text>
        </View>

        {/* ===== Hero Section ===== */}
        <View style={styles.hero}>
          <Text style={styles.hello}>Hello, {userName}</Text>

          <Text style={styles.title}>Take control{"\n"}of your money.</Text>

          <Text style={styles.subtitle}>
            Track expenses, set goals and build better financial habits with a
            simple and modern experience.
          </Text>

          {/* Feature Pills */}
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Budgets</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Insights</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Goals</Text>
            </View>
          </View>
        </View>

        {/* ===== Bottom Sheet ===== */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>Get Started</Text>
          <Text style={styles.sheetSubtitle}>
            Login to continue or create your account in seconds.
          </Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Register</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            Secure • Private • Student-focused
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0E0E12", // premium dark background
  },
  safe: {
    flex: 1,
  },

  // ===== Header =====
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 30,
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  logoText: {
    fontWeight: "900",
    color: "#111",
  },
  brandText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ===== Hero =====
  hero: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  hello: {
    fontSize: 16,
    color: "#BBBBBB",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: "#AAAAAA",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  pillRow: {
    flexDirection: "row",
    gap: 10,
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
  },
  pillText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  // ===== Bottom Sheet =====
  sheet: {
    padding: spacing.lg,
    backgroundColor: "#15151C",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: spacing.sm,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: spacing.lg,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFD600",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },

  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1C1C24",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  footerText: {
    marginTop: spacing.md,
    textAlign: "center",
    fontSize: 12,
    color: "#666",
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
