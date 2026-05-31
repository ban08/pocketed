import * as React from "react";
import { useContext } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";
import { AuthContext } from "../../context/AuthContext";
import { clearCurrentUser } from "../../services/authService";
import { useFocusEffect, useRouter } from "expo-router";
import { styles, dashColors } from "./DashboardScreen.style";
import { Expense } from "@/src/models/Expense";
import { getUserData, calculateSummary } from "@/src/services/expenseService";
import { Budget } from "@/src/models/Budget";
import {
  getGreeting,
  formatCurrency,
  formatDate,
  getInitials,
  getSpentByCategory,
  groupExpensesByCategory,
  getBudgetPercent,
  getBudgetLevel,
  getBalanceLevel,
} from "./dashboardUtils";
import {
  categoryTestId,
  getCategoryFallbackColor,
} from "@/src/utils/categoryColor";


const AppLogo = require("@/assets/images/pocketed-icon-color.png"); 
const BrandText = require("@/assets/images/pocketed-logo-green.png");

const MONTHLY_SAVINGS = 0;

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
  if (dashColors.cat[category]) return dashColors.cat[category];
  return getCategoryFallbackColor(category);
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
  const userInitials = getInitials(userName);

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

  const balanceLevel = getBalanceLevel(BALANCE);
  const categoryGroups = groupExpensesByCategory(expenses);
  const balanceColor =
    balanceLevel === "positive"
      ? dashColors.positive
      : balanceLevel === "negative"
      ? dashColors.negative
      : dashColors.neutral;

  const remaining = MONTHLY_BUDGET - MONTHLY_SPENT;
  const spentPct = getBudgetPercent(MONTHLY_SPENT, MONTHLY_BUDGET);

  return (
    <View 
      testID="dashboard-screen"
      style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Image 
                source={AppLogo} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>
            <Image 
              source={BrandText} 
              style={styles.brandImage} 
              resizeMode="contain" 
            />
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
              Here&apos;s your financial summary
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
                      getBudgetLevel(spentPct) === "over"
                        ? dashColors.negative
                        : getBudgetLevel(spentPct) === "warn"
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
              testID="dashboard-categories-button"
              onPress={() => router.push("/categories")}
              style={({ pressed }) => [
                styles.actionSecondary,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Icon.BarChart size={18} color={dashColors.textPrimary} />
              <Text style={styles.actionSecondaryText}>Categories</Text>
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
            {loading ? (
              <View style={styles.transactionEmptyState}>
                <Text style={styles.transactionEmptyText}>
                  Loading transactions
                </Text>
              </View>
            ) : expenses.length === 0 ? (
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

          {/* ===== Category Groups ===== */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expenses by Category</Text>
            <Pressable
              testID="dashboard-manage-categories-link"
              onPress={() => router.push("/categories")}
              accessibilityRole="button"
            >
              <Text style={styles.seeAll}>Manage</Text>
            </Pressable>
          </View>
          <View style={styles.categoryGroupsCard}>
            {loading ? (
              <View style={styles.categoryGroupEmptyState}>
                <Text style={styles.categoryGroupEmptyText}>
                  Loading categorized expenses
                </Text>
              </View>
            ) : categoryGroups.length === 0 ? (
              <View style={styles.categoryGroupEmptyState}>
                <Text style={styles.categoryGroupEmptyText}>
                  No categorized expenses yet
                </Text>
              </View>
            ) : (
              categoryGroups.map((group, index) => {
                const tint = categoryColor(group.category);
                const preview = group.expenses
                  .slice(0, 2)
                  .map((expense) => expense.title)
                  .join(" · ");

                return (
                  <React.Fragment key={group.category}>
                    {index > 0 && <View style={styles.categoryGroupDivider} />}
                    <View
                      testID={`dashboard-category-group-${categoryTestId(group.category)}`}
                      style={styles.categoryGroupRow}
                    >
                      <View style={styles.categoryGroupTop}>
                        <View style={styles.categoryGroupNameWrap}>
                          <View
                            style={[
                              styles.categoryGroupDot,
                              { backgroundColor: tint },
                            ]}
                          />
                          <View style={styles.categoryGroupTextWrap}>
                            <Text style={styles.categoryGroupName}>
                              {group.category}
                            </Text>
                            <Text style={styles.categoryGroupMeta}>
                              {group.count}{" "}
                              {group.count === 1 ? "expense" : "expenses"}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.categoryGroupTotal}>
                          {formatCurrency(group.total)}
                        </Text>
                      </View>
                      {preview.length > 0 && (
                        <Text style={styles.categoryGroupPreview}>
                          {preview}
                        </Text>
                      )}
                    </View>
                  </React.Fragment>
                );
              })
            )}
          </View>

          {/* ===== Budget Overview ===== */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget Overview</Text>
            <Pressable
              onPress={() => router.push("/add-budget")}
              accessibilityRole="button"
            >
              <Text style={styles.seeAll}>Manage</Text>
            </Pressable>
          </View>
          <View style={styles.budgetsCard}>
            {budgets.map((b) => {
              const spent = getSpentByCategory(expenses, b.category);
              const pct = getBudgetPercent(spent, b.limit);
              const tint = categoryColor(b.category);
              const level = getBudgetLevel(pct);
              const barColor =
                level === "over"
                  ? dashColors.negative
                  : level === "warn"
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
