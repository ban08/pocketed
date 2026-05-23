import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import { styles, addScreenPalette } from "../AddExpenseScreen/AddExpenseScreen.style";
import { AuthContext } from "@/src/context/AuthContext";
import { BASE_URL } from "@/src/services/api";

type IconProps = { size?: number; color?: string };

const Icon = {
  ChevronLeft: ({ size = 20, color = addScreenPalette.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Grid: ({ size = 18, color = addScreenPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  ),
  Target: ({ size = 18, color = addScreenPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
    </Svg>
  ),
};

export default function AddBudgetScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const handleSave = async () => {
    if (!category || !limit) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }
    try {
      await fetch(`${BASE_URL}/users/${user.id}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          limit: Number(limit),
          period: "monthly",
        }),
      });
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save budget");
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon.ChevronLeft />
          </Pressable>
          <Text style={styles.title}>Add Budget</Text>
        </View>

        {/* ===== Form ===== */}
        <View style={styles.content}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconWrap}>
              <Icon.Grid />
            </View>
            <TextInput
              testID="budget-category-input"
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Food"
              placeholderTextColor="#5B6471"
            />
          </View>

          <Text style={styles.label}>Limit</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconWrap}>
              <Icon.Target />
            </View>
            <TextInput
              testID="budget-limit-input"
              style={styles.input}
              value={limit}
              onChangeText={setLimit}
              keyboardType="numeric"
              placeholder="e.g. 500"
              placeholderTextColor="#5B6471"
            />
          </View>

          <Pressable
            testID="budget-save-button"
            onPress={handleSave}
            style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPrimaryPressed,
            ]}
          >
            <Text style={styles.buttonText}>Save Budget</Text>
          </Pressable>

          <Pressable
            testID="budget-cancel-button"
            onPress={() => router.back()}
            style={styles.buttonSecondary}
          >
            <Text style={styles.buttonSecondaryText}>Cancel</Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );
}
