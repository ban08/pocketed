import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F6F7F9",
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  backButtonText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 13,
  },
  headerTitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    color: colors.textPrimary,
  },
  spacer: {
    width: 72,
  },

  introCard: {
    backgroundColor: colors.secondary,
    borderRadius: 18,
    padding: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.brand,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 3,
  },
  introTitle: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.primary,
  },
  introSubtitle: {
    marginTop: spacing.xs + 2,
    fontSize: 14,
    color: "rgba(255,255,255,0.68)",
    lineHeight: 20,
  },

  photoCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  photoLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  avatarRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  avatarShell: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: "#C7D2FE",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallbackText: {
    color: colors.secondary,
    fontSize: 28,
    fontWeight: "800",
  },
  avatarMeta: {
    flex: 1,
    minWidth: 0,
  },
  avatarHint: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.xs + 4,
    lineHeight: 18,
  },
  avatarButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 8,
  },
  photoButton: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    minHeight: 40,
    width: 104,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  photoButtonGhost: {
    borderWidth: 1.2,
    borderColor: "#FCA5A5",
    borderRadius: 999,
    minHeight: 40,
    width: 104,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  photoButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  photoButtonGhostText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
  },

  fieldsGroup: {
    gap: spacing.sm,
  },
  fieldCard: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  fieldValueMuted: {
    color: colors.textSecondary,
    fontWeight: "500",
  },
  fieldInput: {
    minHeight: 28,
    padding: 0,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  saveButton: {
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 3,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.6,
  },

  note: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
