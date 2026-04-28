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
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";
import { AuthContext } from "../../context/AuthContext";
import { clearCurrentUser } from "../../services/authService";
import { useFocusEffect } from "expo-router";
import { useRouter } from "expo-router";
import { styles, dashColors } from "./DashboardScreen.style";
import { Expense } from "@/src/models/Expense";
import { getUserData, calculateSummary } from "@/src/services/expenseService";
import { Budget } from "@/src/models/Budget";

const MONTHLY_SAVINGS = 0;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(d: string): string {
  // Best-effort: keep whatever the source gave us if it's not parseable.
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

// ─── Inline SVG icon set (no emoji) ──────────────────────────────────────────
// 1.5px stroke, lucide-style. Size + color are props.

type IconProps = { size?: number; color?: string };

const Icon = {
  Bell: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  LogOut: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  TrendUp: ({ size = 14, color = dashColors.positive }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 17l6-6 4 4 8-8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 7h7v7" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  TrendDown: ({ size = 14, color = dashColors.negative }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7l6 6 4-4 8 8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 17h7v-7" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Wallet: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7a2 2 0 0 1 2-2h12v4" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={3} y={7} width={18} height={12} rx={2} stroke={color} strokeWidth={1.5} />
      <Circle cx={17} cy={13} r={1.3} fill={color} />
    </Svg>
  ),
  PiggyBank: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12c0-3 2.5-5 6-5h5l3-2v3.5c1 .8 1.5 2 1.5 3.5 0 1.5-.5 2.7-1.5 3.5V19h-3v-1.5h-5V19H7v-1.5C5.2 16.4 4 14.5 4 12Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Circle cx={9} cy={11.5} r={0.9} fill={color} />
    </Svg>
  ),
  Target: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
    </Svg>
  ),
  Plus: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  Minus: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  Coins: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={9} r={5.5} stroke={color} strokeWidth={1.5} />
      <Path d="M9.5 14.5C13 14.4 15.5 12 15.5 9c0-1.4-.5-2.6-1.4-3.6M14.5 19.5c3.5-.1 6-2.5 6-5.5 0-1.4-.5-2.6-1.4-3.6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  BarChart: ({ size = 18, color = dashColors.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={6} y1={20} x2={6} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={12} y1={20} x2={12} y2={6} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={18} y1={20} x2={18} y2={15} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
  ArrowDownLeft: ({ size = 16, color = dashColors.positive }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 7L7 17M7 17h8M7 17V9" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  ArrowUpRight: ({ size = 16, color = dashColors.negative }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 17L17 7M17 7H9M17 7v8" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
};

// Category → tint dot color
function categoryColor(category: string): string {
  return dashColors.cat[category] || dashColors.cat.Other;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BudgetBar({
  spent,
  total,
  color,
}: {
  spent: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.min(spent / total, 1) : 0;
  return (
    <View style={styles.budgetTrack}>
      <View
        style={[
          styles.budgetFill,
          { width: `${pct * 100}%` as any, backgroundColor: color },
        ]}
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  // --- Real user data ---
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const userName = user?.name || "User";
  const userInitials =
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const handleProfilePress = React.useCallback(() => {
    router.push("/(tabs)/profile");
  }, [router]);

  // --- Logout handler ---
  const handleLogout = React.useCallback(async () => {
    await clearCurrentUser();
    logout();
    router.replace("/auth/login");
  }, [logout, router]);

  // --- Get real data ----
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        setLoading(true);

        try {
          const data = await getUserData(user.id);

          setExpenses(data.expenses);
          setBudgets(data.budgets);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [user])
  );

  const MONTHLY_GOALS = budgets.length;
  const MONTHLY_BUDGET = budgets.reduce((sum, b) => sum + b.limit, 0);

  const {
    income: MONTHLY_INCOME,
    spent: MONTHLY_SPENT,
    balance: BALANCE,
  } = calculateSummary(expenses);

  const balanceColor =
    BALANCE > 0
      ? dashColors.positive
      : BALANCE < 0
      ? dashColors.negative
      : dashColors.neutral;

  const remaining = MONTHLY_BUDGET - MONTHLY_SPENT;
  const spentPct = MONTHLY_BUDGET
    ? Math.round((MONTHLY_SPENT / MONTHLY_BUDGET) * 100)
    : 0;

  const getSpentByCategory = (category: string) => {
    return expenses
      .filter((e) => e.category === category && e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>P.</Text>
            </View>
            <Text style={styles.brandText}>Pocket</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Notifications"
            >
              <Icon.Bell />
              <View style={styles.iconBadgeDot} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
              onPress={handleProfilePress}
              testID="dashboard-profile-button"
              accessibilityRole="button"
              accessibilityLabel={`Open profile for ${userName}`}
            >
              <Text style={styles.avatarText}>{userInitials}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
              onPress={handleLogout}
              testID="dashboard-logout-button"
              accessibilityLabel="Logout"
            >
              <Icon.LogOut />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Greeting ===== */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingEyebrow}>{getGreeting()}</Text>
            <Text style={styles.greeting}>{userName}</Text>
            <Text style={styles.greetingSubtitle}>
              Here's your financial summary
            </Text>
          </View>

          {/* ===== Monthly Summary Card ===== */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View style={styles.summaryBalanceBlock}>
                <Text style={styles.summaryLabel}>Balance</Text>
                <Text
                  testID="dashboard-balance-value"
                  style={[styles.balanceAmount, { color: balanceColor }]}
                >
                  {formatCurrency(BALANCE)}
                </Text>
                <View style={styles.balanceDelta}>
                  {BALANCE >= 0 ? (
                    <Icon.TrendUp size={14} color={dashColors.positive} />
                  ) : (
                    <Icon.TrendDown size={14} color={dashColors.negative} />
                  )}
                  <Text
                    style={[styles.balanceDeltaText, { color: balanceColor }]}
                  >
                    {BALANCE >= 0 ? "Net positive" : "Net negative"} this month
                  </Text>
                </View>
              </View>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryChipText}>
                  {new Date().toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressMetaRow}>
              <Text style={styles.progressMetaText}>
                <Text style={styles.progressMetaValue}>
                  {formatCurrency(MONTHLY_SPENT)}
                </Text>{" "}
                of {formatCurrency(MONTHLY_BUDGET)} budget
              </Text>
              <Text style={styles.progressMetaValue}>{spentPct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${spentPct}%` as any,
                    backgroundColor:
                      spentPct >= 100
                        ? dashColors.negative
                        : spentPct >= 80
                        ? "#FBBF24"
                        : dashColors.accent,
                  },
                ]}
              />
            </View>

            {/* Income / Spent split */}
            <View style={styles.summarySplit}>
              <View style={styles.summarySplitCol}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text
                  testID="dashboard-income-value"
                  style={[styles.summaryAmount, { color: dashColors.positive }]}
                >
                  {formatCurrency(MONTHLY_INCOME)}
                </Text>
              </View>
              <View style={styles.summarySplitDivider} />
              <View style={styles.summarySplitColRight}>
                <Text style={styles.summaryLabel}>Spent</Text>
                <Text
                  testID="dashboard-spent-value"
                  style={[styles.summaryAmount, { color: dashColors.negative }]}
                >
                  {formatCurrency(MONTHLY_SPENT)}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== Stats Row ===== */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Icon.Wallet color={dashColors.accent} />
              </View>
              <Text testID="dashboard-remaining-value" style={styles.statValue}>
                {formatCurrency(remaining)}
              </Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Icon.PiggyBank color={dashColors.accent} />
              </View>
              <Text style={styles.statValue}>
                {formatCurrency(MONTHLY_SAVINGS)}
              </Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Icon.Target color={dashColors.accent} />
              </View>
              <Text style={styles.statValue}>{MONTHLY_GOALS}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
          </View>

          {/* ===== Quick Actions ===== */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsRow}>
            <Pressable
              testID="dashboard-add-income-button"
              onPress={() => router.push("/add-income")}
              style={({ pressed }) => [
                styles.actionSecondary,
                pressed && styles.pressed,
              ]}
            >
              <Icon.ArrowDownLeft size={18} color={dashColors.positive} />
              <Text style={styles.actionSecondaryText}>Income</Text>
            </Pressable>
            <Pressable
              testID="dashboard-add-expense-button"
              onPress={() => router.push("/add-expense")}
              style={({ pressed }) => [
                styles.actionPrimary,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Icon.Plus size={18} color={"#0B0D10"} />
              <Text style={styles.actionPrimaryText}>Expense</Text>
            </Pressable>
            <Pressable
              testID="dashboard-add-budget-button"
              onPress={() => router.push("/add-budget")}
              style={({ pressed }) => [
                styles.actionSecondary,
                pressed && styles.pressed,
              ]}
            >
              <Icon.Coins size={18} color={dashColors.textPrimary} />
              <Text style={styles.actionSecondaryText}>Budget</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionSecondary,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Icon.BarChart size={18} color={dashColors.textPrimary} />
              <Text style={styles.actionSecondaryText}>Reports</Text>
            </Pressable>
          </View>

          {/* ===== Recent Transactions ===== */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable accessibilityRole="button">
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <View style={styles.transactionsCard}>
            {expenses.length === 0 ? (
              <View style={styles.transactionEmptyState}>
                <Text style={styles.transactionEmptyText}>
                  No transactions yet
                </Text>
              </View>
            ) : (
              expenses.map((tx, index) => {
                const isIncome = tx.amount < 0;
                return (
                  <React.Fragment key={tx.id}>
                    {index > 0 && <View style={styles.transactionDivider} />}
                    <Pressable
                      style={({ pressed }) => [
                        styles.transactionRow,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.transactionIcon}>
                        {isIncome ? (
                          <Icon.ArrowDownLeft
                            size={18}
                            color={dashColors.positive}
                          />
                        ) : (
                          <Icon.ArrowUpRight
                            size={18}
                            color={dashColors.negative}
                          />
                        )}
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionTitle}>{tx.title}</Text>
                        <Text style={styles.transactionMeta}>
                          {tx.category} · {formatDate(tx.date)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.transactionAmount,
                          {
                            color: isIncome
                              ? dashColors.positive
                              : dashColors.negative,
                          },
                        ]}
                      >
                        {isIncome
                          ? `+${formatCurrency(Math.abs(tx.amount))}`
                          : `−${formatCurrency(tx.amount)}`}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                );
              })
            )}
          </View>

          {/* ===== Budget Overview ===== */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget Overview</Text>
            <Pressable accessibilityRole="button">
              <Text style={styles.seeAll}>Manage</Text>
            </Pressable>
          </View>
          <View style={styles.budgetsCard}>
            {budgets.map((b) => {
              const spent = getSpentByCategory(b.category);
              const pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
              const tint = categoryColor(b.category);
              const barColor =
                pct >= 100
                  ? dashColors.negative
                  : pct >= 80
                  ? "#FBBF24"
                  : tint;

              return (
                <View key={b.id} style={styles.budgetItem}>
                  <View style={styles.budgetRow}>
                    <View style={styles.budgetLeft}>
                      <View
                        style={[styles.budgetCatDot, { backgroundColor: tint }]}
                      />
                      <Text style={styles.budgetName}>{b.category}</Text>
                    </View>
                    <Text style={styles.budgetMeta}>
                      <Text style={styles.budgetMetaStrong}>
                        {formatCurrency(spent)}
                      </Text>{" "}
                      / {formatCurrency(b.limit)}
                    </Text>
                  </View>
                  <BudgetBar spent={spent} total={b.limit} color={barColor} />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
