import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ===== Root ===== */
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl + 16,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontWeight: "900",
    color: colors.primary,
    fontSize: 14,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    flexShrink: 1,
  },
  profileButton: {
    minHeight: 40,
    maxWidth: 190,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingLeft: 4,
    paddingRight: spacing.md,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileInitials: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  profileInitialsText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  profileButtonText: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },

  /* ===== Greeting ===== */
  greetingSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* ===== Summary Card ===== */
  summaryCard: {
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -1,
  },
  balanceAmount: {
    fontSize: 22,   // було ~32-40 → занадто
    fontWeight: "600",
  },
  summaryBudgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  summaryBudgetText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  summaryPercent: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  /* ===== Stats Row ===== */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    margin: 10,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
    margin: 4,
  },
  statEmoji: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  /* ===== Section Header ===== */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondary,
  },

  /* ===== Quick Actions ===== */
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    margin: 10,
    marginBottom: spacing.lg,
  },
  actionPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  actionPrimaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  actionSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  actionSecondaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondary,
  },

  /* ===== Transactions ===== */
  transactionsCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  transactionDivider: {
    height: 1,
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  transactionMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.danger,
  },

  /* ===== Budget Overview ===== */
  budgetsCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.md,
    margin: 16,
    marginBottom: spacing.lg,
  },
  budgetItem: {
    margin: 6,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetLeft: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
  },
  budgetEmoji: {
    fontSize: 16,
  },
  budgetName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  budgetMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  budgetTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
  },
  budgetFill: {
    height: 6,
    borderRadius: 3,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
