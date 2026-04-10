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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
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
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  introTitle: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
  },
  introSubtitle: {
    marginTop: spacing.xs + 2,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  photoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 22,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  photoLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  avatarRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  avatarShell: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallbackText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  avatarMeta: {
    flex: 1,
  },
  avatarHint: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginBottom: spacing.xs + 4,
  },
  avatarButtonRow: {
    flexDirection: "row",
    gap: 8,
  },
  photoButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  photoButtonGhost: {
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  photoButtonText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "700",
  },
  photoButtonGhostText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  fieldsGroup: {
    gap: spacing.sm,
  },
  fieldCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.background_dark,
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
