import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import { AuthContext } from "@/src/context/AuthContext";
import { Expense } from "@/src/models/Expense";
import { Category } from "@/src/models/Category";
import { getUserData } from "@/src/services/expenseService";
import {
  cleanCategoryName,
  createCategory,
  getCategories,
  mergeCategoryNames,
  withDefaultCategories,
} from "@/src/services/categoryService";
import {
  formatCurrency,
  groupExpensesByCategory,
} from "../DashboardScreen/dashboardUtils";
import { styles, categoryPalette } from "./CategoryManagementScreen.style";

type IconProps = { size?: number; color?: string };

const fallbackCategoryColors = [
  "#7BE3B5",
  "#F4A988",
  "#88B7F4",
  "#C8A0F2",
  "#F2D27A",
  "#F87171",
];

const Icon = {
  ChevronLeft: ({ size = 20, color = categoryPalette.textPrimary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  Tag: ({ size = 18, color = categoryPalette.textSecondary }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={7} cy={7} r={1} fill={color} />
    </Svg>
  ),
  Plus: ({ size = 20, color = categoryPalette.accentText }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
};

function categoryColor(category: string): string {
  const hash = category
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return fallbackCategoryColors[hash % fallbackCategoryColors.length];
}

function categoryTestId(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CategoryManagementScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    if (!user?.id) {
      setCategories(withDefaultCategories([]));
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [data, storedCategories] = await Promise.all([
        getUserData(user.id),
        getCategories(user.id),
      ]);
      const expenseCategories = Array.isArray(data.expenses)
        ? data.expenses
            .filter((expense: Expense) => expense.amount > 0)
            .map((expense: Expense) => expense.category)
        : [];
      const budgetCategories = Array.isArray(data.budgets)
        ? data.budgets.map((budget: { category?: string }) => budget.category)
        : [];
      const names = mergeCategoryNames(
        storedCategories.map((category) => category.name),
        expenseCategories,
        budgetCategories
      );
      const mergedCategories = withDefaultCategories(
        names.map((name) => {
          const existing = storedCategories.find(
            (category) =>
              category.name.toLocaleLowerCase() === name.toLocaleLowerCase()
          );
          return existing ?? { id: name, name };
        })
      );

      setCategories(mergedCategories);
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
    } catch (error) {
      console.error(error);
      setCategories(withDefaultCategories([]));
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  const spendingByCategory = useMemo(() => {
    const groups = groupExpensesByCategory(expenses);
    return new Map(groups.map((group) => [group.category, group]));
  }, [expenses]);

  const handleCreate = async () => {
    const cleanName = cleanCategoryName(categoryName);
    if (!cleanName) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }
    if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }
    if (
      categories.some(
        (category) => category.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase()
      )
    ) {
      setCategoryName("");
      return;
    }

    try {
      const created = await createCategory(user.id, cleanName);
      setCategories((current) => withDefaultCategories([...current, created]));
      setCategoryName("");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create category");
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon.ChevronLeft />
          </Pressable>
          <Text style={styles.title}>Categories</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconWrap}>
                <Icon.Tag />
              </View>
              <TextInput
                testID="category-name-input"
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="e.g. Groceries"
                placeholderTextColor="#5B6471"
              />
            </View>
            <Pressable
              testID="category-create-button"
              onPress={handleCreate}
              style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Create category"
            >
              <Icon.Plus />
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category Spending</Text>
          </View>

          <View style={styles.categoryCard}>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Loading categories</Text>
              </View>
            ) : categories.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No categories yet</Text>
              </View>
            ) : (
              categories.map((category, index) => {
                const group = spendingByCategory.get(category.name);
                const count = group?.count ?? 0;
                const total = group?.total ?? 0;

                return (
                  <React.Fragment key={category.id}>
                    {index > 0 && <View style={styles.categoryDivider} />}
                    <View
                      testID={`category-row-${categoryTestId(category.name)}`}
                      style={styles.categoryRow}
                    >
                      <View style={styles.categoryTop}>
                        <View style={styles.categoryNameWrap}>
                          <View
                            style={[
                              styles.categoryDot,
                              { backgroundColor: categoryColor(category.name) },
                            ]}
                          />
                          <View style={styles.categoryTextWrap}>
                            <Text style={styles.categoryName}>{category.name}</Text>
                            <Text style={styles.categoryMeta}>
                              {count === 0
                                ? "No expenses"
                                : `${count} ${count === 1 ? "expense" : "expenses"}`}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.categoryAmount}>
                          {formatCurrency(total)}
                        </Text>
                      </View>
                    </View>
                  </React.Fragment>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
