import { StyleSheet } from "react-native";

const palette = {
  bg: "#0B0D10",
  surface: "#14171C",
  surfaceElevated: "#1B1F26",
  hairline: "rgba(255,255,255,0.06)",
  textPrimary: "#F5F6F8",
  textSecondary: "#9CA3AF",
  textTertiary: "#5B6471",
  accent: "#7BE3B5",
  accentText: "#0B0D10",
};

const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export const addScreenPalette = palette;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  safeArea: {
    flex: 1,
  },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.lg,
    gap: space.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
  },

  /* ===== Content ===== */
  content: {
    paddingHorizontal: space.lg,
  },
  contentBody: {
    paddingBottom: 40,
  },

  /* ===== Form ===== */
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.textTertiary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: space.xs + 4,
    marginTop: space.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.hairline,
    paddingHorizontal: space.md,
    height: 52,
  },
  inputIconWrap: {
    marginRight: space.sm + 4,
    opacity: 0.55,
  },
  input: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: 15,
  },

  /* ===== Category Pills ===== */
  categoryRow: {
    gap: space.sm,
    marginTop: space.xl,
    marginBottom: space.xl,
    justifyContent: "center",
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 50,
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: palette.hairline,
  },
  categoryPillActive: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.textSecondary,
  },
  categoryPillTextActive: {
    color: palette.accentText,
  },

  /* ===== Buttons ===== */
  buttonPrimary: {
    height: 54,
    borderRadius: 16,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimaryPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.accentText,
    letterSpacing: 0.2,
  },
  buttonSecondary: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.sm,
  },
  buttonSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textSecondary,
  },

  pressed: { opacity: 0.7 },
});
