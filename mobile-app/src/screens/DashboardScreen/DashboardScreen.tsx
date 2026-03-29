import * as React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { styles } from "./DashboardScreen.style";
import { Expense } from "@/src/models/Expense";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USER = { name: "Alex", initials: "AJ" };

const MONTHLY_BUDGET = 1200;
const MONTHLY_SPENT = 748.5;
const MONTHLY_SAVINGS = 180;
const MONTHLY_GOALS = 3;

const MOCK_TRANSACTIONS: (Expense & { emoji: string })[] = [
  { id: "1", title: "Grocery Run", amount: 42.3, category: "Food", date: "Today", emoji: "🛒" },
  { id: "2", title: "Bus Pass", amount: 15.0, category: "Transport", date: "Today", emoji: "🚌" },
  { id: "3", title: "Pizza Night", amount: 28.5, category: "Dining", date: "Yesterday", emoji: "🍕" },
  { id: "4", title: "Netflix", amount: 12.99, category: "Entertainment", date: "Mar 14", emoji: "🎬" },
  { id: "5", title: "Textbooks", amount: 89.0, category: "Education", date: "Mar 13", emoji: "📚" },
];

const MOCK_BUDGETS = [
  { name: "Food & Dining", emoji: "🍔", spent: 320, total: 400, color: "#6366F1" },
  { name: "Transport", emoji: "🚌", spent: 65, total: 150, color: "#10B981" },
  { name: "Entertainment", emoji: "🎬", spent: 55, total: 100, color: "#F59E0B" },
  { name: "Education", emoji: "📚", spent: 189, total: 300, color: "#3B82F6" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
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
  const spentPct = Math.round((MONTHLY_SPENT / MONTHLY_BUDGET) * 100);
  const remaining = MONTHLY_BUDGET - MONTHLY_SPENT;

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
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              accessibilityLabel="Notifications"
            >
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </Pressable>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{MOCK_USER.initials}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Greeting ===== */}
          <View style={styles.greetingSection}>
            <Text testID="greeting">Good</Text>
            <Text style={styles.greeting}>{getGreeting()}, {MOCK_USER.name} 👋</Text>
            <Text style={styles.greetingSubtitle}>Here's your financial summary</Text>
          </View>

          {/* ===== Monthly Summary Card ===== */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Spent this month</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(MONTHLY_SPENT)}</Text>
            <View style={styles.summaryBudgetRow}>
              <Text style={styles.summaryBudgetText}>of {formatCurrency(MONTHLY_BUDGET)} budget</Text>
              <Text style={styles.summaryPercent}>{spentPct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${spentPct}%` as any }]} />
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
              style={({ pressed }) => [styles.actionPrimary, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 16 }}>➕</Text>
              <Text style={styles.actionPrimaryText}>Add Expense</Text>
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
            {MOCK_TRANSACTIONS.map((tx, index) => (
              <React.Fragment key={tx.id}>
                {index > 0 && <View style={styles.transactionDivider} />}
                <Pressable
                  style={({ pressed }) => [styles.transactionRow, pressed && styles.pressed]}
                >
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionEmoji}>{tx.emoji}</Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{tx.title}</Text>
                    <Text style={styles.transactionMeta}>{tx.category} · {tx.date}</Text>
                  </View>
                  <Text style={styles.transactionAmount}>-{formatCurrency(tx.amount)}</Text>
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
            {MOCK_BUDGETS.map((b) => (
              <View key={b.name} style={styles.budgetItem}>
                <View style={styles.budgetRow}>
                  <View style={styles.budgetLeft}>
                    <Text style={styles.budgetEmoji}>{b.emoji}</Text>
                    <Text style={styles.budgetName}>{b.name}</Text>
                  </View>
                  <Text style={styles.budgetMeta}>
                    {formatCurrency(b.spent)} / {formatCurrency(b.total)}
                  </Text>
                </View>
                <BudgetBar spent={b.spent} total={b.total} color={b.color} />
              </View>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
