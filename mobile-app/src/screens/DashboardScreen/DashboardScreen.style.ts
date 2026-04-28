import { StyleSheet } from "react-native";

/**
 * Dark, modern, minimal dashboard.
 * Theme tokens are declared inline (instead of importing colors/spacing/typography)
 * so this file is a true drop-in replacement: copy it over the existing
 * DashboardScreen.style.ts and the screen renders without touching the rest
 * of the theme. If you'd rather feed these from "@/src/theme/...", swap the
 * literals back in — the keys exported below are unchanged.
 */

const palette = {
  // Surfaces
  bg: "#0B0D10",
  surface: "#14171C",
  surfaceElevated: "#1B1F26",
  surfaceMuted: "#10131800",
  hairline: "rgba(255,255,255,0.06)",
  hairlineStrong: "rgba(255,255,255,0.10)",

  // Text
  textPrimary: "#F5F6F8",
  textSecondary: "#9CA3AF",
  textTertiary: "#5B6471",

  // Accent (single, restrained mint)
  accent: "#7BE3B5",
  accentMuted: "rgba(123,227,181,0.14)",
  accentText: "#0B0D10",

  // Semantic
  success: "#34D399",
  danger: "#F87171",
  warning: "#FBBF24",

  // Category tints (low-saturation, dark-friendly)
  catFood: "#F4A988",
  catTransport: "#88B7F4",
  catEntertainment: "#C8A0F2",
  catEducation: "#F2D27A",
  catOther: "#9CA3AF",
};

const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const dashboardTheme = { palette, space };

export const styles = StyleSheet.create({
  /* ===== Root ===== */
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontWeight: "900",
    color: palette.accentText,
    fontSize: 15,
    letterSpacing: -0.5,
  },
  brandText: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.accent,
    borderWidth: 2,
    borderColor: palette.bg,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: palette.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: palette.textPrimary,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.2,
  },

  /* ===== Greeting ===== */
  greetingSection: {
    paddingHorizontal: space.lg,
    marginBottom: space.lg,
  },
  greetingEyebrow: {
    fontSize: 12,
    color: palette.textTertiary,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.6,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: 4,
  },

  /* ===== Summary Card ===== */
  summaryCard: {
    marginHorizontal: space.lg,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    padding: space.lg,
    marginBottom: space.md,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: space.lg,
  },
  summaryBalanceBlock: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: palette.textTertiary,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: space.xs,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -1.2,
  },
  balanceDelta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.xs,
    gap: 4,
  },
  balanceDeltaText: {
    fontSize: 12,
    fontWeight: "600",
  },
  summaryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: palette.hairline,
  },
  summaryChipText: {
    fontSize: 11,
    color: palette.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  /* progress segment */
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.surfaceElevated,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.accent,
  },
  progressMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: space.sm,
    marginBottom: space.lg,
  },
  progressMetaText: {
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: "500",
  },
  progressMetaValue: {
    fontSize: 12,
    color: palette.textPrimary,
    fontWeight: "700",
  },

  /* split (income/spent) */
  summarySplit: {
    flexDirection: "row",
    paddingTop: space.lg,
    borderTopWidth: 1,
    borderTopColor: palette.hairline,
  },
  summarySplitCol: {
    flex: 1,
  },
  summarySplitColRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  summarySplitDivider: {
    width: 1,
    backgroundColor: palette.hairline,
    marginHorizontal: space.lg,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
    marginTop: 2,
  },

  /* ===== Stats Row ===== */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: space.lg,
    marginBottom: space.xl,
    gap: space.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: space.md,
    borderWidth: 1,
    borderColor: palette.hairline,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: palette.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 11,
    color: palette.textSecondary,
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: 0.2,
  },

  /* ===== Section Header ===== */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: space.lg,
    marginBottom: space.md,
    marginTop: space.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.2,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.accent,
  },

  /* ===== Quick Actions ===== */
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: space.lg,
    marginBottom: space.xl,
    gap: space.sm,
  },
  actionPrimary: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  actionPrimaryText: {
    fontSize: 11,
    fontWeight: "700",
    color: palette.accentText,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  actionSecondary: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.hairline,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  actionSecondaryText: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.textPrimary,
    marginTop: 4,
    letterSpacing: 0.2,
  },

  /* ===== Transactions ===== */
  transactionsCard: {
    marginHorizontal: space.lg,
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.hairline,
    overflow: "hidden",
    marginBottom: space.xl,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingVertical: 14,
  },
  transactionDivider: {
    height: 1,
    backgroundColor: palette.hairline,
    marginHorizontal: space.lg,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: palette.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
    letterSpacing: -0.1,
  },
  transactionMeta: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 3,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  transactionEmptyState: {
    paddingVertical: space.xl,
    alignItems: "center",
  },
  transactionEmptyText: {
    fontSize: 13,
    color: palette.textTertiary,
  },

  /* ===== Budget Overview ===== */
  budgetsCard: {
    marginHorizontal: space.lg,
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.hairline,
    padding: space.lg,
    marginBottom: space.xl,
    gap: space.lg,
  },
  budgetItem: {
    gap: space.sm,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  budgetCatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  budgetName: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  budgetMeta: {
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: "500",
  },
  budgetMetaStrong: {
    color: palette.textPrimary,
    fontWeight: "700",
  },
  budgetTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.surfaceElevated,
    overflow: "hidden",
  },
  budgetFill: {
    height: 6,
    borderRadius: 3,
  },

  pressed: {
    opacity: 0.7,
  },
});

/** Color helpers exported so the .tsx can keep logic + theme aligned. */
export const dashColors = {
  positive: palette.success,
  negative: palette.danger,
  neutral: palette.textSecondary,
  accent: palette.accent,
  surfaceElevated: palette.surfaceElevated,
  textPrimary: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textTertiary: palette.textTertiary,
  bg: palette.bg,
  cat: {
    Food: palette.catFood,
    Transport: palette.catTransport,
    Entertainment: palette.catEntertainment,
    Education: palette.catEducation,
    Other: palette.catOther,
  } as Record<string, string>,
};
