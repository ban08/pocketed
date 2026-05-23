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
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { AuthContext } from "../../context/AuthContext";
import { clearCurrentUser } from "../../services/authService";
import { getUserData, calculateSummary } from "../../services/expenseService";
import { styles, profilePalette } from "./UserProfileScreen.style";

function formatCurrency(amount: number): string {
  return amount.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

type IconProps = { size?: number; color?: string };

const Icon = {
  User: ({ size = 18, color = profilePalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.5} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  Mail: ({ size = 18, color = profilePalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={4} width={20} height={16} rx={2} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M2 8l10 6 10-6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  LogOut: ({ size = 18, color = profilePalette.negative }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
};

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
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Pressable
            testID="back-button"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Text style={{ color: "white", fontSize: 16 }}>← Back</Text>
          </Pressable>
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
                <Text style={[styles.statValue, { color: profilePalette.positive }]}>{fmt(income)}</Text>
              </View>
              <View style={[styles.statItem, styles.statItemBorder]}>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={[styles.statValue, { color: profilePalette.negative }]}>{fmt(spent)}</Text>
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
              <View style={styles.infoIconWrap}>
                <Icon.User />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userName}</Text>
              </View>
            </View>
            <View style={styles.infoRowDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Icon.Mail />
              </View>
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
            <Icon.LogOut />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
