import * as React from "react";
import { useContext } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import { clearCurrentUser } from "../../services/authService";
import { getUserData, calculateSummary } from "../../services/expenseService";
import { styles } from "./UserProfileScreen.style";

function formatCurrency(amount: number): string {
  return amount.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

export default function UserProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const [income, setIncome] = React.useState<number | null>(null);
  const [spent, setSpent] = React.useState<number | null>(null);
  const [balance, setBalance] = React.useState<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.id) return;
      let active = true;
      (async () => {
        try {
          const data = await getUserData(user.id);
          if (!active) return;
          const summary = calculateSummary(data.expenses);
          setIncome(summary.income);
          setSpent(summary.spent);
          setBalance(summary.balance);
        } catch {
          // API unreachable — stats stay null, shown as "—"
        }
      })();
      return () => { active = false; };
    }, [user])
  );

  const handleSignOut = React.useCallback(async () => {
    await clearCurrentUser();
    logout();
    router.replace("/auth/login");
  }, [logout, router]);

  const fmt = (v: number | null) => v === null ? "—" : formatCurrency(v);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Hero ===== */}
          <View style={styles.heroSection}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{userInitials}</Text>
            </View>
            <Text style={styles.heroName}>{userName}</Text>
            <Text style={styles.heroEmail}>{userEmail}</Text>
          </View>

          {/* ===== Financial Summary ===== */}
          <Text style={styles.sectionLabel}>Financial Summary</Text>
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.statValue}>{fmt(income)}</Text>
              </View>
              <View style={[styles.statItem, styles.statItemBorder]}>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={styles.statValue}>{fmt(spent)}</Text>
              </View>
              <View style={[styles.statItem, styles.statItemBorder]}>
                <Text style={styles.statLabel}>Balance</Text>
                <Text style={styles.statValue}>{fmt(balance)}</Text>
              </View>
            </View>
          </View>

          {/* ===== Account Info ===== */}
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>👤</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userName}</Text>
              </View>
            </View>
            <View style={styles.infoRowDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>✉️</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userEmail}</Text>
              </View>
            </View>
          </View>

          {/* ===== Sign Out ===== */}
          <Text style={styles.sectionLabel}>Session</Text>
          <Pressable
            testID="profile-sign-out-button"
            style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Text style={{ fontSize: 18 }}>🚪</Text>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
