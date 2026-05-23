import { StyleSheet } from "react-native";

const palette = {
  bg: "#0B0D10",
  surface: "#14171C",
  surfaceElevated: "#1B1F26",
  hairline: "rgba(255,255,255,0.06)",
  hairlineStrong: "rgba(255,255,255,0.10)",
  textPrimary: "#F5F6F8",
  textSecondary: "#9CA3AF",
  textTertiary: "#5B6471",
  accent: "#7BE3B5",
  accentMuted: "rgba(123,227,181,0.12)",
  accentText: "#0B0D10",
  positive: "#34D399",
  negative: "#F87171",
};

const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export const profilePalette = palette;

export const styles = StyleSheet.create({
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
    paddingBottom: space.xl + 16,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
  },

  /* ===== Hero ===== */
  heroSection: {
    alignItems: "center",
    paddingVertical: space.xl,
    paddingHorizontal: space.lg,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: palette.surfaceElevated,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
  avatarLargeText: {
    color: palette.accent,
    fontWeight: "800",
    fontSize: 32,
    letterSpacing: -0.5,
  },
  heroName: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: 14,
    color: palette.textSecondary,
  },

  /* ===== Section Label ===== */
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: palette.textTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: space.lg,
    marginBottom: space.sm,
    marginTop: space.md,
  },

  /* ===== Stats Card ===== */
  statsCard: {
    marginHorizontal: space.lg,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    padding: space.lg,
    marginBottom: space.md,
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
    borderLeftColor: palette.hairline,
  },
  statLabel: {
    fontSize: 11,
    color: palette.textTertiary,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
  },

  /* ===== Info Card ===== */
  card: {
    marginHorizontal: space.lg,
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.hairline,
    overflow: "hidden",
    marginBottom: space.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    paddingVertical: 14,
    gap: space.md,
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: palette.hairline,
    marginHorizontal: space.md,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: palette.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: palette.textTertiary,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.textPrimary,
  },

  /* ===== Sign Out ===== */
  signOutButton: {
    marginHorizontal: space.lg,
    marginTop: space.sm,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(248,113,113,0.10)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.20)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: space.sm,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.negative,
  },

  pressed: {
    opacity: 0.7,
  },
});
