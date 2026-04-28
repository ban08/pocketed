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
import { AuthContext } from "../../context/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import { styles } from "./DashboardScreen.style";
import { Expense } from "@/src/models/Expense";
import { getUserData, calculateSummary } from "@/src/services/expenseService";
import { Budget } from "@/src/models/Budget";

const categoryEmoji: Record<string, string> = {
  Food: "🍔",
  Transport: "🚌",
  Entertainment: "🎬",
  Education: "📚",
  Other: "💸",
};

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function BudgetBar({ spent, total, color }: { spent: number; total: number; color: string }) {
  const pct = Math.min(spent / total, 1);
  return (
    <View style={styles.budgetTrack}>
      <View style={[styles.budgetFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  // --- Real user data ---
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const userName = user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const handleProfilePress = React.useCallback(() => {
    router.push("/(tabs)/profile");
  }, [router]);

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

  const { income: MONTHLY_INCOME, spent: MONTHLY_SPENT, balance: BALANCE } =
  calculateSummary(expenses);

  const balanceColor =
    BALANCE > 0 ? "#22C55E" :
    BALANCE < 0 ? "#EF4444" :
    "#6B7280";

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
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* ===== Header ===== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>P.</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
              onPress={handleProfilePress}
              accessibilityRole="button"
              accessibilityLabel={`Open profile for ${userName}`}
            >
              <View style={styles.profileInitials}>
                <Text style={styles.profileInitialsText}>{userInitials}</Text>
              </View>
              <Text style={styles.profileButtonText} numberOfLines={1}>
                {userName}
              </Text>
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
            <Text style={styles.greeting}>{getGreeting()}, {userName} 👋</Text>
            <Text style={styles.greetingSubtitle}>Here's your financial summary</Text>
          </View>

          {/* ===== Monthly Summary Card ===== */}
          <View style={styles.summaryCard}>

            {/* NEW ROW */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

              {/* LEFT — INCOME */}
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={styles.summaryAmount}>
                  {formatCurrency(MONTHLY_INCOME)}
                </Text>
              </View>

              {/* RIGHT — EXPENSE */}
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.summaryLabel}>Spent</Text>
                <Text style={styles.summaryAmount}>
                  {formatCurrency(MONTHLY_SPENT)}
                </Text>
              </View>

            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.summaryBudgetText}>
                of {formatCurrency(MONTHLY_BUDGET)} budget
              </Text>
              <Text style={styles.summaryPercent}>{spentPct}%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${spentPct}%` as any }]} />
            </View>

            <View style={{ marginTop: 12, alignItems: "center" }}>
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={[styles.balanceAmount, { color: balanceColor }]}>
                {formatCurrency(BALANCE)}
              </Text>
            </View>

          </View>

          {/* ===== Stats Row ===== */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>💳</Text>
              <Text style={styles.statValue}>{formatCurrency(remaining)}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🏦</Text>
              <Text style={styles.statValue}>{formatCurrency(MONTHLY_SAVINGS)}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎯</Text>
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
              onPress={() => router.push("/add-income")}
              style={({ pressed }) => [styles.actionSecondary, pressed && styles.pressed]}
            >
              <Text style={{ fontSize: 16 }}>💵</Text>
              <Text style={styles.actionSecondaryText}>Add Income</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/add-expense")}
              style={({ pressed }) => [styles.actionPrimary, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 16 }}>➕</Text>
              <Text style={styles.actionPrimaryText}>Add Expense</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/add-budget")}
              style={({ pressed }) => [styles.actionSecondary, pressed && styles.pressed]}
            >
              <Text style={{ fontSize: 16 }}>💰</Text>
              <Text style={styles.actionSecondaryText}>Add Budget</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionSecondary, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 16 }}>📊</Text>
              <Text style={styles.actionSecondaryText}>Budgets</Text>
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
            {expenses.map((tx, index) => (
              <React.Fragment key={tx.id}>
                {index > 0 && <View style={styles.transactionDivider} />}
                <Pressable
                  style={({ pressed }) => [styles.transactionRow, pressed && styles.pressed]}
                >
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionEmoji}>💸</Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{tx.title}</Text>
                    <Text style={styles.transactionMeta}>{tx.category} · {tx.date}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: tx.amount < 0 ? "#22C55E" : "#EF4444" },
                    ]}
                    >
                    {tx.amount < 0
                      ? `+${formatCurrency(Math.abs(tx.amount))}`
                      : `-${formatCurrency(tx.amount)}`
                    }
                  </Text>
                </Pressable>
              </React.Fragment>
            ))}
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

              return (
                <View key={b.id} style={styles.budgetItem}>
                  <View style={styles.budgetRow}>
                    <View style={styles.budgetLeft}>
                      <Text style={styles.budgetEmoji}>
                        {categoryEmoji[b.category] || "💸"}
                      </Text>
                      <Text style={styles.budgetName}>{b.category}</Text>
                    </View>
                    <Text style={styles.budgetMeta}>
                      {formatCurrency(spent)} / {formatCurrency(b.limit)}
                    </Text>
                  </View>
                  <BudgetBar spent={spent} total={b.limit} color="#6366F1" />
                </View>
              );
            })}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
