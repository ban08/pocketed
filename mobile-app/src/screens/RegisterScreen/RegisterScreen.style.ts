import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ===== Layout ===== */
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* ===== Image Hero Banner ===== */
  heroBanner: {
    height: 310,
  },
  heroBannerImage: {
    resizeMode: "cover",
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 8,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacing.xl,
  },
  heroTopGroup: {
    flex: 0,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs + 8,
  },
  logoText: {
    fontWeight: "900",
    color: colors.green,
  },
  brandText: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.primary,
  },

  /* ===== Hero Text ===== */
  greeting: {
    fontSize: typography.title.fontSize + 4,
    fontWeight: typography.title.fontWeight,
    color: colors.hero,
    lineHeight: 36,
  },
  subtitle: {
    ...typography.body,
    color: colors.blue,
    marginTop: spacing.xs + 2,
    lineHeight: 20,
  },

  /* ===== Feature Pills ===== */
  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: spacing.md,
  },
  pill: {
    backgroundColor: colors.red,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  pillText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "600",
  },

  /* ===== Card ===== */
  cardWrapper: {
    flex: 1,
    marginTop: -24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    backgroundColor: colors.red,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  cardHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.textSecondary,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: spacing.lg,
    opacity: 0.3,
  },

  /* ===== Form ===== */
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.xs + 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    paddingHorizontal: spacing.md,
    height: 52,
    marginBottom: spacing.md,
    opacity: 0.85,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: spacing.xs + 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.body.fontSize,
  },

  /* ===== Primary Button ===== */
  primaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: "800",
    color: colors.background,
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginTop: spacing.md,
  },
  termsLink: {
    color: colors.secondary,
    fontWeight: "600",
  },

  /* ===== Divider ===== */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md + 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary,
    opacity: 0.25,
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 13,
    paddingHorizontal: spacing.md,
  },

  /* ===== Secondary Button ===== */
  secondaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: "700",
    color: colors.primary,
  },

  /* ===== Footer ===== */
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondary,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
