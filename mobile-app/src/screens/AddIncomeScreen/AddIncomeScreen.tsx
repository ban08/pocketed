import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, Line } from "react-native-svg";
import { styles, addScreenPalette } from "../AddExpenseScreen/AddExpenseScreen.style";
import { AuthContext } from "@/src/context/AuthContext";
import { addIncome } from "@/src/services/expenseService";

type IconProps = { size?: number; color?: string };

const Icon = {
  ChevronLeft: ({ size = 20, color = addScreenPalette.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Tag: ({ size = 18, color = addScreenPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  DollarSign: ({ size = 18, color = addScreenPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={12} y1={1} x2={12} y2={23} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
};

const incomeCategories = [
  "Salary",
  "Scholarship",
  "Bonus",
  "Gift",
  "Freelance",
  "Investment",
  "Other",
];

export default function AddIncomeScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");

  const handleSave = async () => {
    console.log("HANDLE START");
    if (!title || !amount) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }
    try {
      console.log("TRY START");
      await addIncome(user.id, {
        title,
        amount: Number(amount),
        category: "Income",
        date: new Date().toISOString().split("T")[0],
      });
      console.log("SUCCESS");
      router.back();
    } catch (error) {
      console.error("ERROR", error);
      Alert.alert("Error", "Failed to save income");
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
          <Text style={styles.title}>Add Income</Text>
        </View>

        {/* ===== Form ===== */}
        <View style={styles.content}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconWrap}>
              <Icon.Tag />
            </View>
            <TextInput
              testID="income-title-input"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Monthly salary"
              placeholderTextColor="#5B6471"
            />
          </View>

          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconWrap}>
              <Icon.DollarSign />
            </View>
            <TextInput
              testID="income-amount-input"
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="e.g. 1200"
              placeholderTextColor="#5B6471"
            />
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            {incomeCategories.map((cat) => (
              <Pressable
                key={cat}
                testID={`income-category-${cat.toLowerCase()}`}
                onPress={() => {
                  setCategory(cat);
                  setTitle(cat);
                }}
                style={[
                  styles.categoryPill,
                  category === cat && styles.categoryPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    category === cat && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            testID="income-save-button"
            onPress={() => {
              console.log("PRESS WORKS");
              handleSave();
            }}
            style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPrimaryPressed,
            ]}
          >
            <Text style={styles.buttonText}>Save Income</Text>
          </Pressable>

          <Pressable
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
