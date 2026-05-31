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

export const loginPalette = palette;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },

  /* ===== Hero Banner ===== */
  heroBanner: { height: 280 },
  heroBannerImage: { resizeMode: "cover" },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(11,13,16,0.78)",
    paddingHorizontal: space.lg,
    paddingBottom: space.xl + 8,
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: space.lg,
  },
  heroTopGroup: { flex: 0 },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.xl,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.sm + 4,
  },
  logoText: {
    fontWeight: "900",
    color: palette.accentText,
    fontSize: 15,
    letterSpacing: -0.5,
  },
  brandText: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.textPrimary,
    letterSpacing: -0.2,
  },

  logoImage: {
  width: 40,      // Adjust to fit your design
  height: 40,     // Adjust to fit your design
},
  brandImage: {
  width: 120,     // Adjust based on your text image's aspect ratio
  height: 30,     // Adjust based on your text image's aspect ratio
  marginLeft: 10, // Gives a clean spacing between the icon box and the brand text
},

  /* ===== Hero Text ===== */
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    marginTop: 6,
    lineHeight: 22,
  },

  /* ===== Card ===== */
  cardWrapper: {
    flex: 1,
    marginTop: -24,
  },
  scrollContent: { flexGrow: 1 },
  card: {
    flex: 1,
    backgroundColor: palette.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: palette.hairline,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xl,
  },
  cardHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: space.lg,
  },

  /* ===== Form ===== */
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.textTertiary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: space.xs + 4,
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
    marginBottom: space.md,
  },
  inputIconWrap: {
    marginRight: space.sm + 4,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: 15,
  },
  forgotText: {
    alignSelf: "flex-end",
    color: palette.accent,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: space.lg,
  },

  /* ===== Primary Button ===== */
  primaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.accentText,
    letterSpacing: 0.2,
  },

  /* ===== Divider ===== */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: space.md + 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.hairline,
  },
  dividerText: {
    color: palette.textTertiary,
    fontSize: 12,
    paddingHorizontal: space.md,
    fontWeight: "500",
  },

  /* ===== Secondary Button ===== */
  secondaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.hairline,
    backgroundColor: palette.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.textPrimary,
  },

  /* ===== Footer ===== */
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: space.lg,
  },
  footerText: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.accent,
  },

  pressed: { opacity: 0.7 },
});
