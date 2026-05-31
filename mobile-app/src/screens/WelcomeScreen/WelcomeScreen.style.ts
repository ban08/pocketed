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

export const welcomePalette = palette;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  safe: {
    flex: 1,
  },

  image: {
    marginTop: -260,
    width: "00%",
    height: "00%",
    resizeMode: "cover",
  },


  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,1)",
  },

  /* ===== Header ===== */
  header: {
    paddingHorizontal: space.lg,
    paddingTop: space.xl + 30,
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.sm,
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

  /* ===== Hero ===== */
  hero: {
    flex: 1,
    paddingHorizontal: space.lg,
    justifyContent: "center",
  },
  hello: {
    fontSize: 14,
    color: palette.textTertiary,
    fontWeight: "600",
    letterSpacing: 0.4,
    marginBottom: space.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: palette.textPrimary,
    lineHeight: 42,
    letterSpacing: -1,
    marginBottom: space.md,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    lineHeight: 22,
    marginBottom: space.lg,
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

  /* ===== Feature Pills ===== */
  pillRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(123,227,181,0.10)",
    borderWidth: 1,
    borderColor: "rgba(123,227,181,0.22)",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  pillText: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: "600",
  },

  /* ===== Bottom Sheet ===== */
  sheet: {
    padding: space.lg,
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: palette.hairline,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: space.md,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: -0.4,
    marginBottom: space.sm,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: space.lg,
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  /* Login — primary accent */
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: palette.accentText,
    letterSpacing: 0.2,
  },

  /* Register — outlined */
  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.hairline,
    backgroundColor: palette.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.textPrimary,
  },

  /* Continue as guest — ghost */
  thirdButton: {
    width: "100%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.xs,
  },
  thirdButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textTertiary,
  },

  footerText: {
    marginTop: space.md,
    textAlign: "center",
    fontSize: 12,
    color: palette.textTertiary,
    letterSpacing: 0.2,
  },

  pressed: {
    opacity: 0.7,
  },
});
