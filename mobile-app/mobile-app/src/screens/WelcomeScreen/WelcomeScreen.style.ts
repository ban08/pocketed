import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0E0E12", // premium dark background
  },
  safe: {
    flex: 1,
  },

  // ===== Header =====
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 30,
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  logoText: {
    fontWeight: "900",
    color: colors.textPrimary,
  },
  brandText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.brand,
  },

  // ===== Hero =====
  hero: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },

  // background image style
  image: {
    marginTop: -260, // pull the image up to create a more immersive effect
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    //marginBottom: 1000, // pull the image down at the bottom to create a seamless transition to the sheet
  },

  // overlay placed above the background image to keep content readable
  overlay: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hello: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  pillRow: {
    flexDirection: "row",
    gap: 10,
  },
  pill: {
    backgroundColor: colors.background_dark,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
  },
  pillText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },

  // ===== Bottom Sheet =====
  sheet: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: colors.background_dark,
    marginBottom: spacing.lg,
  },

  buttonRow: {
    flexDirection: "column",
    alignItems: "stretch",
    // gap may not be supported consistently; use margin on the first button instead
  },

  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.background_dark,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.background_dark,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm, // space between stacked buttons
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background_dark,
  },

  footerText: {
    marginTop: spacing.md,
    textAlign: "center",
    fontSize: 12,
    color: colors.textDark,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
