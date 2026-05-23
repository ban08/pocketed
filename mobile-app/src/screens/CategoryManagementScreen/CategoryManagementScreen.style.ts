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
  danger: "#F87171",
};

const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export const categoryPalette = palette;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  safeArea: {
    flex: 1,
  },
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
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.lg,
    paddingBottom: 44,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.textTertiary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: space.xs + 4,
    marginTop: space.md,
  },
  inputRow: {
    flexDirection: "row",
    gap: space.sm,
  },
  inputWrapper: {
    flex: 1,
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
  createButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accent,
  },
  sectionHeader: {
    marginTop: space.xl,
    marginBottom: space.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  categoryCard: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.hairline,
    overflow: "hidden",
  },
  categoryRow: {
    paddingHorizontal: space.lg,
    paddingVertical: 14,
  },
  categoryDivider: {
    height: 1,
    backgroundColor: palette.hairline,
    marginHorizontal: space.lg,
  },
  categoryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
  },
  categoryNameWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: space.sm,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  categoryMeta: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 3,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  emptyState: {
    paddingVertical: space.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: palette.textTertiary,
  },
  pressed: {
    opacity: 0.7,
  },
});
