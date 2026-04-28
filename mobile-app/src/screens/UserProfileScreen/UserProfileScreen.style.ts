import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  headerTitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: colors.textPrimary,
  },

  /* ===== Hero ===== */
  heroSection: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarLargeText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 34,
  },
  heroName: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  /* ===== Section label ===== */
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: spacing.lg,
    marginBottom: 8,
    marginTop: spacing.md,
  },

  /* ===== Card ===== */
  card: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  /* ===== Info rows ===== */
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: 12,
    width: 28,
    textAlign: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  /* ===== Financial stats ===== */
  statsCard: {
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.brand,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.25)",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.5,
  },

  /* ===== Sign Out ===== */
  signOutButton: {
    marginHorizontal: spacing.lg,
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.danger,
    marginLeft: 8,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
